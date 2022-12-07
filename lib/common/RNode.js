/** @template {import('./Routify').Routify<any>} InstanceType */
export class RNode {
    /** @type {InstanceType['NodeType']} */
    parent

    /** @type {Object.<string, any>} */
    meta = {}

    /** @type {String} */
    id

    /**
     * @param {string} name
     * @param {ReservedCmpProps|string} module
     * @param {InstanceType} instance
     */
    constructor(name, module, instance) {
        /** @type {InstanceType} */
        this.instance = instance
        this.name = name

        instance.nodeIndex.push(this)
        this.module = module
        Object.defineProperty(this, 'instance', { enumerable: false })
        Object.defineProperty(this, 'parent', { enumerable: false })
    }

    /** @param {InstanceType['NodeConstructor']['prototype']} child */
    appendChild(child) {
        if (child.instance) child.parent = this
    }

    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     */
    createChild(name, module) {
        const node = /** @type {InstanceType['NodeConstructor']['prototype']} */ (
            this.instance.createNode(name, module)
        )
        this.appendChild(node)
        return node
    }

    /** @type {InstanceType['NodeConstructor']['prototype'][]} */
    get descendants() {
        return this.instance.nodeIndex.filter(node =>
            node.ancestors.find(n => n === this),
        )
    }

    remove() {
        const { nodeIndex } = this.instance
        const index = nodeIndex.findIndex(node => node === this)
        nodeIndex.splice(index, 1)
    }

    /** @type {InstanceType['NodeConstructor']['prototype'][]} */
    get ancestors() {
        let node = this
        const ancestors = []
        while ((node = node.parent)) ancestors.push(node)

        return ancestors
    }

    /** @type {InstanceType['NodeConstructor']['prototype']} */
    get root() {
        let node = this
        while (node.parent) node = node.parent
        return node
    }

    get isRoot() {
        return this === this.root
    }

    /** @type {InstanceType['NodeType'][]} */
    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    /** @returns {number} */
    get level() {
        return (this.parent?.level || 0) + 1
    }

    /** @type {Object.<string,RegExp>} */
    _regex = {}

    get regex() {
        // match against name to make sure regex stays working if name is changed
        const { name } = this
        if (!this._regex[name])
            this._regex[name] = this.instance.utils.getRegexFromName(this.name)
        return this._regex[name]
    }

    // save to regex key so regex gets invalidated if name changes
    set regex(value) {
        this._regex[this.name] = new RegExp(value)
    }

    /**
     * @type {Object.<string, string[]>}
     * */
    _paramKeys = {}

    get paramKeys() {
        // match against name to make sure regex stays working if name is changed
        const { name } = this
        if (!this._paramKeys[name])
            this._paramKeys[name] = this.instance.utils.getFieldsFromName(this.name)
        return this._paramKeys[name]
    }

    /**
     * returns parameters for a given urlFragment
     * @param {string} urlFragment
     */
    getParams(urlFragment) {
        // if the path is '.' or '..' return nothing
        if (urlFragment.match(/^\.+$/)) return {}

        const values = this.instance.utils.getValuesFromPath(this.regex, urlFragment)
        return this.instance.utils.mapFieldsWithValues(this.paramKeys, values)
    }

    // todo traverse should use the getChainTo API interface

    /**
     * resolve a node relative to this node
     * @param {string} path
     * @param {boolean} allowDynamic allow traversing dynamic components (parameterized)
     * @param {boolean} includeIndex
     * @param {boolean} silent don't throw errors for 404s
     * @returns {this}
     */
    traverse(path, allowDynamic = false, includeIndex = false, silent = false) {
        const isNamed = !path.startsWith('/') && !path.startsWith('.')
        return isNamed
            ? this.root.instance.nodeIndex.find(node => node.meta.name === path)
            : this.getChainTo(path, { allowDynamic, includeIndex, silent })?.pop().node
    }

    /**
     * Returns an array of steps to reach a path. Each path contains a node and params
     * @param {string} path
     * @param {object} [options]
     * @param {boolean} [options.allowDynamic=true]
     * @param {boolean} [options.includeIndex=true]
     * @param {boolean} [options.silent=false] don't throw errors for 404s
     * @param {this} [options.rootNode]
     
     */
    getChainTo(path, options) {
        options = {
            ...{ allowDynamic: true, includeIndex: true },
            ...options,
        }

        /** @type {InstanceType['NodeConstructor']['prototype']} */
        const originNode = path.startsWith('/') ? options.rootNode || this.root : this

        /**
         * The path from current node to the leaf page, eg. "blog", "posts", "some-story", "comments", "123"
         * @type {string[]}
         * */
        const stepsToLeaf = path
            .split('/')
            .filter(snip => snip !== '.')
            .filter(Boolean)

        let currentNodeStep = {
            node: originNode,
            stepsToLeaf,
            params: {},
            fragment: '',
        }
        const nodeSteps = [currentNodeStep]

        let inStaticDeadEnd = false // if true, don't look for a static component
        let inDynamicDeadEnd = false // if true, don't look for a dynamic component

        while (currentNodeStep.stepsToLeaf.length) {
            const [nextStep, ...restSteps] = currentNodeStep.stepsToLeaf
            // console.log(`in "${nodeSteps.map(ns => ns.node.name).join('/')}" looking for "${nextStep}"`)

            const nextNode =
                nextStep === '..'
                    ? currentNodeStep.node.parent
                    : (!inStaticDeadEnd &&
                          currentNodeStep.node.children.find(
                              node => node.name === nextStep,
                          )) ||
                      (options.allowDynamic &&
                          !inDynamicDeadEnd &&
                          currentNodeStep.node.children
                              .filter(({ meta }) => meta.dynamic && !meta.dynamicSpread)
                              .find(node => node.regex.test(nextStep))) ||
                      (options.allowDynamic &&
                          currentNodeStep.node.children.find(
                              node => node.meta.dynamicSpread,
                          ))

            if (nextNode) {
                // we found a node that matches the next url fragment
                // console.log(nodeSteps.map(ns => ns.node.name).join('/') + '/' + nextNode.name)

                const nodeStep = {
                    node: nextNode,
                    params: nextNode.meta.dynamicSpread
                        ? [nextStep]
                        : nextNode.meta.dynamic
                        ? nextNode.getParams(nextStep)
                        : {},
                    stepsToLeaf: restSteps,
                    fragment: nextStep,
                }
                currentNodeStep = nodeStep
                nodeSteps.push(nodeStep)
            } else if (!options.allowDynamic && options.silent) return null
            else if (!options.allowDynamic && !options.silent)
                throw new Error(
                    `${nodeSteps
                        .map(ns => ns.node.name || 'root')
                        .join('/')} could not travel to ${nextStep}`,
                )
            else if (currentNodeStep.node.meta.dynamicSpread) {
                // we didn't find a node matching the next step, but we're inside a dynamic spread parameter node, so we'll use that
                currentNodeStep.params.push(nextStep)
                currentNodeStep.fragment += `/${nextStep}`
                currentNodeStep.stepsToLeaf.shift()
                inDynamicDeadEnd = false
                inStaticDeadEnd = false
            } else {
                // we didn't find a node and the current node doesn't have spread parameters. Let's backtrack.
                // console.log(`backtracking from ${nodeSteps.map(ns => ns.node.name).join('/')}`)
                nodeSteps.pop()
                currentNodeStep = [...nodeSteps].pop()
                inDynamicDeadEnd = inStaticDeadEnd
                inStaticDeadEnd = true
                if (!currentNodeStep && options.silent) return null
                else if (!currentNodeStep && !options.silent)
                    throw new Error(`Could not find path "${path}" from ${this.name}`)
            }
        }

        // append an index component if one exists
        try {
            const indexNode =
                options.includeIndex && currentNodeStep.node.traverse('./index')

            if (indexNode)
                nodeSteps.push({
                    node: indexNode,
                    stepsToLeaf: [],
                    params: {},
                    fragment: '',
                })
        } catch (err) {}

        // normalize params so that spread parameters get a key
        nodeSteps.forEach(ns => {
            ns.params = Array.isArray(ns.params)
                ? { [ns.node.name.replace(/\[\.\.\.(.+)\]/, '$1')]: ns.params }
                : ns.params
        })

        return nodeSteps
    }

    /** @returns {InstanceType['NodeConstructor']['prototype']} */
    toJSON() {
        return {
            ...this,
            children: [...this.children],
        }
    }

    /** @returns {string} */
    get path() {
        return (
            '/' +
            [this, ...this.ancestors]
                .reverse()
                .map(node => node.name)
                .filter(Boolean)
                .join('/')
        )
    }
}

/**
 * @template {typeof import('./Routify')['Routify']} R
 */
export class RNode {
    /** @type {R['prototype']} */
    instance

    /** @type {this} */
    parent

    /** @type {Object.<string, any>} */
    meta = {}

    /** @type {String} */
    id

    /** @type {String|LoadSvelteModule} */
    asyncModule

    /**
     * @param {string} name
     * @param {ReservedCmpProps|string} module
     * @param {R['prototype']} instance
     */
    constructor(name, module, instance) {
        this.instance = instance
        this.name = name

        instance.nodeIndex.push(this)
        this.module = module
        Object.defineProperty(this, 'Instance', { enumerable: false })
        Object.defineProperty(this, 'instance', { enumerable: false })
        Object.defineProperty(this, 'parent', { enumerable: false })
    }

    /** @param {this} child */
    appendChild(child) {
        child.parent = this
    }

    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {this}
     */
    createChild(name, module) {
        const node = this.instance.createNode(name, module)
        this.appendChild(node)
        return node
    }

    /** @returns {this[]} */
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

    get ancestors() {
        let node = this
        const ancestors = []
        while ((node = node.parent)) ancestors.push(node)

        return ancestors
    }

    get root() {
        /** @type {this} */
        let node = this
        while (node.parent) node = node.parent
        return node
    }

    get isRoot() {
        return this === this.root
    }

    /** @returns {this[]} */
    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    /** @returns {number} */
    get level() {
        return (this.parent?.level || 0) + 1
    }

    /** @type {Object.<string,RegExp>} */
    #regex = {}

    get regex() {
        // match against name to make sure regex stays working if name is changed
        const { name } = this
        if (!this.#regex[name])
            this.#regex[name] = this.instance.utils.getRegexFromName(this.name)
        return this.#regex[name]
    }

    // save to regex key so regex gets invalidated if name changes
    set regex(value) {
        this.#regex[this.name] = new RegExp(value)
    }

    /**
     * @type {Object.<string, string[]>}
     * */
    #paramKeys = {}

    get paramKeys() {
        // match against name to make sure regex stays working if name is changed
        const { name } = this
        if (!this.#paramKeys[name])
            this.#paramKeys[name] = this.instance.utils.getFieldsFromName(this.name)
        return this.#paramKeys[name]
    }

    /**
     * returns parameters for a given urlFragment
     * @param {string} urlFragment
     */
    getParams(urlFragment) {
        const values = this.instance.utils.getValuesFromPath(this.regex, urlFragment)
        return this.instance.utils.mapFieldsWithValues(this.paramKeys, values)
    }

    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns {this}
     */
    traverse(path, allowDynamic = false, includeIndex = false) {
        const isNamed = !path.startsWith('/') && !path.startsWith('.')
        return isNamed
            ? this.root.instance.nodeIndex.find(node => node.meta.name === path)
            : this.getChainTo(path, allowDynamic, includeIndex).pop().node
    }

    /**
     * Returns an array of steps to reach a path. Each path contains a node and params
     * @param {string} path
     * @param {boolean} allowDynamic
     * @param {boolean} includeIndex
     * @returns
     */
    getChainTo(path, allowDynamic = true, includeIndex = true) {
        const originNode = path.startsWith('/') ? this.root : this

        /**
         * The path from current node to the leaf page, eg. "blog", "posts", "some-story", "comments", "123"
         * @type {string[]}
         * */
        const stepsToLeaf = path
            .split('/')
            .filter(snip => snip !== '.')
            .filter(Boolean)

        /**
         * @type {{node: originNode, params: any, stepsToLeaf: string[], fragment: string}}
         */
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
                      (allowDynamic &&
                          !inDynamicDeadEnd &&
                          currentNodeStep.node.children
                              .filter(({ meta }) => meta.dynamic && !meta.dynamicSpread)
                              .find(node => node.regex.test(nextStep))) ||
                      (allowDynamic &&
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
            } else if (!allowDynamic)
                throw new Error(
                    `"${nodeSteps
                        .map(ns => ns.node.name)
                        .join('/')}" does not contain a node named "${nextStep}"`,
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
                if (!currentNodeStep)
                    throw new Error(`Could not find path "${path}" from ${this.name}`)
            }
        }

        // append an index component if one exists
        try {
            const indexNode = includeIndex && currentNodeStep.node.traverse('./index')

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

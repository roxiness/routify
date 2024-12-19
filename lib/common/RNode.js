import { initializeCache } from './utils.js'

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
        this.name = name || ''

        instance.nodeIndex.push(this)
        this.module = module

        // tie the name to the cache, so that when the name changes, the cache is invalidated
        this._cacheByName = initializeCache(() => this.name, this)

        Object.defineProperty(this, '_cacheByName', { enumerable: false })
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

    clone() {
        const node = /** @type {InstanceType['NodeConstructor']['prototype']} */ (
            this.instance.createNode(this.name, this.module)
        )
        this.parent?.appendChild(node)

        Object.assign(node, this)
        node.meta = { ...this.meta }
        return node
    }

    deepClone() {
        const clone = this.clone()
        this.children.forEach(child => clone.appendChild(child.deepClone()))
        return clone
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
        return this.instance.nodeIndex
            .filter(node => node.parent === this)
            .sort((prev, curr) => (prev.meta.order || 0) - (curr.meta.order || 0))
    }

    get navigableChildren() {
        return this.children.filter(node => !node.meta.noRoute)
    }

    get linkableChildren() {
        return this.navigableChildren.filter(node => node.meta.order != false)
    }

    /** @returns {number} */
    get level() {
        return (this.parent?.level || 0) + 1
    }

    _getRegex() {
        return this.instance.utils.getRegexFromName(this.name)
    }
    get regex() {
        return this._cacheByName(this._getRegex)
    }

    _getParamKeys() {
        return this.instance.utils.getFieldsFromName(this.name)
    }
    get paramKeys() {
        return this._cacheByName(this._getParamKeys)
    }

    _getSpecificity() {
        return [this.name.replace(/\[.+?\]/g, '').length, this.paramKeys.length]
    }
    get specificity() {
        return this._cacheByName(this._getSpecificity)
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

    /**
     * resolve a node relative to this node
     * @param {string} path
     * @param {TraverseOptions} [options]
     * @returns {this}
     */
    traverse(path, options) {
        const isNamed = !path.startsWith('/') && !path.startsWith('.')
        return isNamed
            ? this.root.instance.nodeIndex.find(node => node.meta.name === path)
            : this.getChainTo(path, options)?.pop().node
    }

    /**
     * Returns an array of steps to reach a path. Each path contains a node and params
     * @param {string} path
     * @param {TraverseOptions} [options]
     */
    getChainTo(path, options) {
        options = {
            allowDynamic: false,
            includeIndex: false,
            navigableChildrenOnly: false,
            silent: false,
            ...options,
        }

        const targetChildren = options.navigableChildrenOnly
            ? 'navigableChildren'
            : 'children'

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

            const nextNode =
                nextStep === '..'
                    ? currentNodeStep.node.parent
                    : (!inStaticDeadEnd &&
                          currentNodeStep.node[targetChildren].find(
                              node => node.name === nextStep,
                          )) ||
                      (options.allowDynamic &&
                          !inDynamicDeadEnd &&
                          [...currentNodeStep.node[targetChildren]]
                              .sort(
                                  (a, b) =>
                                      // sort by static specificity, then dynamic specificity
                                      b.specificity[0] - a.specificity[0] ||
                                      b.specificity[1] - a.specificity[1],
                              )
                              .filter(({ meta }) => meta.dynamic && !meta.dynamicSpread)
                              // todo add dynamicSpread nodes to specificity calculation
                              .find(node => node.regex.test(nextStep))) ||
                      (options.allowDynamic &&
                          currentNodeStep.node[targetChildren].find(
                              node => node.meta.dynamicSpread,
                          ))

            if (nextNode) {
                // we found a node that matches the next url fragment

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
            } else if (!options.allowDynamic) {
                // we didn't find a node matching the next step, and we're not allowed to look for dynamic nodes
                if (!options.silent || options.silent === 'report') {
                    const lastStep = nodeSteps.map(ns => ns.node.name || 'root').join('/')
                    const err = new Error(`${lastStep} could not travel to ${nextStep}`)
                    err.name = '404'
                    if (options.silent === 'report') console.error(err)
                    else throw err
                }

                return null
            } else if (currentNodeStep.node.meta.dynamicSpread) {
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
            if (options.includeIndex)
                currentNodeStep.node.getDefaults().forEach(node => {
                    const nodeStep = {
                        node,
                        params: {},
                        stepsToLeaf: [], // we're at the leaf, we no longer need to travel
                        fragment: '',
                    }
                    nodeSteps.push(nodeStep)
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

    getChainToNode(node) {
        const chain = []
        do {
            chain.unshift(node)
            if (node === this) return chain
        } while ((node = node.parent))
    }

    /**
     * Returns the isDefault child nodes recursively
     * Example: /home -> /home/main -> /home/main/index
     * @param {'children'|'navigableChildren'} childType
     */
    getDefaults(childType = 'children') {
        const child = this[childType].find(
            node => node.meta.isDefault || node.name === 'index',
        )
        return child ? [child, ...child.getDefaults(childType)] : []
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

import { Routify } from './Routify.js'

export class RNode {
    Instance = Routify

    /** @type {this["Instance"]["prototype"]['Node']['prototype']} */
    parent

    /** @type {Object.<string, any>} */
    meta = {}

    /** @type {String} */
    id

    /**
     * @param {string} name
     * @param {MixedModule} module
     * @param {any} instance
     */
    constructor(name, module, instance) {
        /** @type {typeof this['Instance']['prototype']} */
        this.instance = instance
        this.name = name

        instance.nodeIndex.push(this)
        this.module = module
        Object.defineProperty(this, 'Instance', { enumerable: false })
        Object.defineProperty(this, 'instance', { enumerable: false })
        Object.defineProperty(this, 'parent', { enumerable: false })
    }

    /** @param {this["Instance"]["prototype"]['Node']['prototype']} child */
    appendChild(child) {
        child.parent = this
    }

    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {this["Instance"]["prototype"]['Node']['prototype']}
     */
    createChild(name, module) {
        const node = this.instance.createNode(name, module)
        this.appendChild(node)
        return node
    }

    /** @returns {this["Instance"]["prototype"]['Node']['prototype'][]} */
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
        /** @type {this} */
        let node = this
        const ancestors = []
        while ((node = node.parent)) ancestors.push(node)

        return ancestors
    }

    get superNode() {
        /** @type {this} */
        let node = this.parent || this
        while (node && node.parent) node = node.parent
        return node
    }

    get isSuperNode() {
        return this === this.superNode
    }

    get root() {
        let node = this
        while (node.parent && !node.parent.isSuperNode) node = node.parent
        return node
    }

    get isRoot() {
        return this === this.root
    }

    /** @returns {this["Instance"]["prototype"]['Node']['prototype'][]} */
    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    /** @returns {number} */
    get level() {
        return (this.parent?.level || 0) + 1
    }

    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns {this["Instance"]["prototype"]['Node']['prototype']}
     */
    traverse(path) {
        const steps = path
            .split('/')
            .filter(snip => snip !== '.')
            .filter(Boolean)

        try {
            const target = steps.reduce(
                (target, step) =>
                    step === '..'
                        ? target.parent
                        : target.children.find(node => node.name === step),
                /** @type {this["Instance"]["prototype"]['Node']['prototype']} */ (this),
            )

            return target
        } catch (err) {
            console.error("can't resolve path", path, 'from', this?.file?.path, '\n', err)
        }
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
                .slice(2) // skip _ROOT and eg. default
                .map(node => node.name)
                .join('/')
        )
    }
}

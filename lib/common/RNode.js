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

    // todo module type should be LoadSvelteModule
    /**
     * @param {string} name
     * @param {any} module
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

    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns {this}
     */
    traverse(path) {
        const originNode = path.startsWith('/') ? this.root : this

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
                originNode,
            )

            return target
        } catch (err) {
            console.error("can't resolve path", path, 'from', this.path, '\n', err)
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
                .map(node => node.name)
                .filter(Boolean)
                .join('/')
        )
    }
}

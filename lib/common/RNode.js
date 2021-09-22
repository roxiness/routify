import '#root/typedef.js'
import { Meta } from './Meta.js'

/**
 * @template {RoutifyRuntime|RoutifyBuildtime} Instance
 */
export class RNode {
    /** @type {Instance} */
    instance

    /** @type {RNode} */
    parent

    /** @type {Object.<string, any>} */
    meta = {}

    /** @type {String} */
    id

    /**
     * @param {string} name
     * @param {MixedModule} module
     * @param {Instance} instance
     */
    constructor(name, module, instance) {
        this.name = name
        instance.nodeIndex.push(this)
        this.module = module
        Object.defineProperty(this, 'instance', {
            get() {
                return instance
            },
            enumerable: false,
        })
        Object.defineProperty(this, 'parent', { enumerable: false })
    }

    /** @param {RNode} child */
    appendChild(child) {
        child.parent = this
    }

    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {RNode}
     */
    createChild(name, module) {
        const node = this.instance.createNode(name, module)
        this.appendChild(node)
        return node
    }

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
        /** @type {RNode} */
        let node = this
        const ancestors = []
        while ((node = node.parent)) ancestors.push(node)

        return ancestors
    }

    get superNode() {
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

    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    get level() {
        return (this.parent?.level || 0) + 1
    }

    traverse(path) {
        const steps = path
            .split('/')
            .filter(snip => snip !== '.')
            .filter(Boolean)

        try {
            const target = steps.reduce(
                (target, step) => (step === '..' ? target.parent : target.children[step]),
                this,
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

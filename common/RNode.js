import '../typedef.js'
import { Meta } from './Meta.js'

/**
 * @template {Routify|RoutifyRuntime|RoutifyBuildtime} Instance
 */
export class RNode {
    /** @type {Instance} */
    instance

    /** @type {RNode} */
    parent

    /** @type {Meta & Object.<any, any>} */
    #meta = new Meta(this)

    /** @type {String} */
    component

    /** @type {String} */
    id

    /**
     * @param {string} name
     * @param {string|Object} component
     * @param {Instance} instance
     */
    constructor(name, component, instance) {
        this.name = name
        instance.nodeIndex.push(this)
        this.component = component
        Object.defineProperty(this, 'instance', {
            get() {
                return instance
            },
            enumerable: false,
        })
        Object.defineProperty(this, 'parent', { enumerable: false })
        Object.defineProperty(this, 'meta', {
            enumerable: true,
            set(meta) {
                Object.entries(meta).forEach(
                    ([key, val]) => (this.#meta[key] = val),
                )
            },
            get: () => this.#meta,
        })
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
    createChild(name, component) {
        const node = this.instance.createNode(name, component)
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

    get root() {
        let node = this.parent || this
        while (node && node.parent) node = node.parent
        return node
    }

    get isRoot() {
        return this === this.root
    }

    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    toJSON() {
        return {
            ...this,
            children: [...this.children],
            component: `${this.component}::_EVAL`,
        }
    }

    get path() {
        return [this, ...this.ancestors]
            .reverse()
            .slice(1)
            .map(node => node.name)
            .join('/')
    }
}

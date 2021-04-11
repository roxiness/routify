// we need Routify for typed JS
import { Routify } from "./Routify.js" // eslint-disable-line

export class Node {

    /** @type {Routify} */
    instance

    /** @type {Node} */
    parent

    meta = {
        bundle: undefined
    }

    constructor(name, instance) {
        this.name = name
        instance.nodeIndex.push(this)
        Object.defineProperty(this, 'instance', { get() { return instance }, enumerable: false })
        Object.defineProperty(this, 'parent', { enumerable: false })
    }

    /** @param {Node} child */
    appendChild(child) {
        child.parent = this
    }

    get descendants() {
        return this.instance.nodeIndex
            .filter(node =>
                node.ancestors.find(n => n === this))
    }

    remove() {
        const { nodeIndex } = this.instance
        const index = nodeIndex.findIndex(node => node === this)
        nodeIndex.splice(index, 1)
    }

    get ancestors() {
        /** @type {Node} */
        let node = this
        const ancestors = [node]
        while ((node = node.parent))
            ancestors.push(node)

        return ancestors
    }

    get root() {
        let node = this.parent || this
        while (node && node.parent)
            node = node.parent
        return node
    }

    get isRoot() {
        return this === this.root
    }

    get children() {
        return this.instance.nodeIndex.filter(node => node.parent === this)
    }

    get map() {
        return {
            ...this,
            children: this.children.map(node => node.map)
        }
    }
}

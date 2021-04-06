import { Routify } from "./Routify.js"

export class Node {
    /** @type {Node} */
    parent

    /** @type {Routify} */
    instance

    meta = {
        bundle: undefined
    }

    constructor(name, instance) {
        this.name = name
        instance.nodeIndex.push(this)
        Object.defineProperty(this, 'instance', {
            get() { return instance }
        })
    }

    appendChild(child) {
        child.parent = this
    }

    remove() {
        const { nodeIndex } = this.instance
        const index = nodeIndex.findIndex(node => node === this)
        nodeIndex.splice(index, 1)
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
        const map = {
            ...this,
            children: this.children.map(node => node.map)
        }
        delete (map.parent)
        delete (map.instance)

        return map
    }
}
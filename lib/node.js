/** @type {Node[]} */
export const nodeIndex = []

export class Node {
    parent = null
    meta = {}

    constructor(name) {
        this.name = name
    }

    appendChild(child) {
        child.parent = this
        nodeIndex.push(child)
    }

    remove() {
        const index = this.nodeIndex.findIndex(node => node === this)
        this.nodeIndex.splice(index, 1)
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
        return nodeIndex.filter(node => node.parent === this)
    }

    get nodeIndex() {
        return nodeIndex
    }

    get map() {
        const map = {
            ...this,
            children: this.children.map(node => node.map)
        }
        delete (map.parent)

        return map
    }
}
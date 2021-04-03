/** @type {Node[]} */
export const nodeIndex = []

export class Node {
    parent = null

    appendChild(child) {
        child.parent = this
        nodeIndex.push(child)
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
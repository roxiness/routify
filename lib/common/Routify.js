import { RNode } from './RNode.js'

export class Routify {
    Node = RNode
    mode = 'runtime'

    /** @type {this['Node']['prototype'][]} */
    nodeIndex = []

    /** @type {typeof this['Node']['prototype']} */
    superNode

    constructor({ Node }) {
        this.superNode = new Node('_ROOT', null, this)
    }

    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {typeof this['Node']['prototype']}
     */
    createNode(name, module) {
        return new this.Node(name, module, this)
    }
}

import { RNode } from './RNode.js'

/**
 * @template {typeof import('./RNode')['RNode']} N
 */
export class Routify {
    Node = RNode
    mode = 'runtime'

    /** @type {N['prototype'][]} */
    nodeIndex = []

    /** @type {N['prototype']} */
    superNode

    constructor({ Node }) {
        this.superNode = new Node('_ROOT', null, this)
    }

    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {N['prototype']}
     */
    createNode(name, module) {
        return new this.Node(name, module, this)
    }
}

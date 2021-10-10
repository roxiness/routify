import { RNode } from './RNode.js'

/**
 * @template {typeof import('./RNode')['RNode']} N
 */
export class Routify {
    Node = RNode
    mode = 'runtime'

    /** @type {N['prototype'][]} */
    nodeIndex = []

    /** @type {Object<string, RNode>} */
    rootNodes = {}

    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {N['prototype']}
     */
    createNode(name, module) {
        return new this.Node(name, module, this)
    }

    constructor(options) {}
}

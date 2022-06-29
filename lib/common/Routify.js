import { UrlParamUtils } from '../runtime/Instance/UrlParamUtils.js'
import { RNode } from './RNode.js'

/**
 * @template {typeof RNode<any>} NodeConstructor
 */
export class Routify {
    /** @type {typeof RNode<any>} */
    NodeConstructor

    /** @type {NodeConstructor['prototype']} */
    NodeType

    /** @type {NodeConstructor['prototype'][]} */
    nodeIndex = []

    /** @type {Object<string, NodeConstructor['prototype']>} */
    rootNodes = {}

    utils = new UrlParamUtils()

    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {this['NodeType']}
     */
    createNode(name, module) {
        return new this.NodeConstructor(name, module, this)
    }
}

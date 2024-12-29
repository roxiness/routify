/**
 * @template {typeof RNode<any>} NodeConstructor
 */
export class Routify<NodeConstructor extends typeof RNode<any>> {
    /** @type {typeof RNode<any>} */
    NodeConstructor: typeof RNode<any>;
    /** @type {NodeConstructor['prototype']} */
    NodeType: NodeConstructor["prototype"];
    /** @type {NodeConstructor['prototype'][]} */
    nodeIndex: NodeConstructor["prototype"][];
    /** @type {Object<string, NodeConstructor['prototype']>} */
    rootNodes: {
        [x: string]: NodeConstructor["prototype"];
    };
    utils: UrlParamUtils;
    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {this['NodeType']}
     */
    createNode(name?: string | undefined, module?: (any | string) | undefined): this["NodeType"];
}
import { RNode } from './RNode.js';
import { UrlParamUtils } from '../runtime/Instance/UrlParamUtils.js';

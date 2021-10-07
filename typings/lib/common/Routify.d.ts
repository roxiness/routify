/**
 * @template {typeof import('./RNode')['RNode']} N
 */
export class Routify<N extends typeof RNode> {
    constructor({ Node }: {
        Node: any;
    });
    Node: typeof RNode;
    mode: string;
    /** @type {N['prototype'][]} */
    nodeIndex: N['prototype'][];
    /** @type {N['prototype']} */
    superNode: N['prototype'];
    /**
     * @param {string=} name relative path for the node
     * @param {any|string=} module svelte component
     * @returns {N['prototype']}
     */
    createNode(name?: string | undefined, module?: (any | string) | undefined): N['prototype'];
}
import { RNode } from "./RNode.js";

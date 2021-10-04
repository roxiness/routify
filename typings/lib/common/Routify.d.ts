export class Routify {
    constructor({ Node }: {
        Node: any;
    });
    Node: typeof RNode;
    mode: string;
    /** @type {this['Node']['prototype'][]} */
    nodeIndex: RNode[];
    /** @type {typeof this['Node']['prototype']} */
    superNode: RNode;
    /**
     * @param {string} name relative path for the node
     * @param {any|string} module svelte component
     * @returns {typeof this['Node']['prototype']}
     */
    createNode(name: string, module: any | string): RNode;
}
import { RNode } from "./RNode.js";

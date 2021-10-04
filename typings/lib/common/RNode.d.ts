export class RNode {
    /**
     * @param {string} name
     * @param {MixedModule} module
     * @param {any} instance
     */
    constructor(name: string, module: MixedModule, instance: any);
    Instance: typeof Routify;
    /** @type {this["Instance"]["prototype"]['Node']['prototype']} */
    parent: RNode;
    /** @type {Object.<string, any>} */
    meta: {
        [x: string]: any;
    };
    /** @type {String} */
    id: string;
    /** @type {typeof this['Instance']['prototype']} */
    instance: Routify;
    name: string;
    module: MixedModule;
    /** @param {this["Instance"]["prototype"]['Node']['prototype']} child */
    appendChild(child: RNode): void;
    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {this["Instance"]["prototype"]['Node']['prototype']}
     */
    createChild(name: string, module: any): RNode;
    /** @returns {this["Instance"]["prototype"]['Node']['prototype'][]} */
    get descendants(): RNode[];
    remove(): void;
    get ancestors(): RNode[];
    get superNode(): RNode;
    get isSuperNode(): boolean;
    get root(): RNode;
    get isRoot(): boolean;
    /** @returns {this["Instance"]["prototype"]['Node']['prototype'][]} */
    get children(): RNode[];
    /** @returns {number} */
    get level(): number;
    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns {this["Instance"]["prototype"]['Node']['prototype']}
     */
    traverse(path: string): RNode;
    toJSON(): RNode & {
        children: RNode[];
    };
    /** @returns {string} */
    get path(): string;
}
import { Routify } from "./Routify.js";

/**
 * @template {typeof import('./Routify')['Routify']} R
 */
export class RNode<R extends typeof import("./Routify").Routify> {
    /**
     * @param {string} name
     * @param {any} module
     * @param {R['prototype']} instance
     */
    constructor(name: string, module: any, instance: R['prototype']);
    /** @type {R['prototype']} */
    instance: R['prototype'];
    /** @type {this} */
    parent: RNode<R>;
    /** @type {Object.<string, any>} */
    meta: {
        [x: string]: any;
    };
    /** @type {String} */
    id: string;
    name: string;
    module: any;
    /** @param {this} child */
    appendChild(child: RNode<R>): void;
    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {this}
     */
    createChild(name: string, module: any): this;
    /** @returns {this[]} */
    get descendants(): RNode<R>[];
    remove(): void;
    get ancestors(): RNode<R>[];
    get root(): RNode<R>;
    get isRoot(): boolean;
    /** @returns {this[]} */
    get children(): RNode<R>[];
    /** @returns {number} */
    get level(): number;
    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns {this}
     */
    traverse(path: string): this;
    toJSON(): RNode<R> & {
        children: RNode<R>[];
    };
    /** @returns {string} */
    get path(): string;
}

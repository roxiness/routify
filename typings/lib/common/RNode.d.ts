/**
 * @template {RoutifyRuntime|RoutifyBuildtime} Instance
 */
export class RNode<Instance extends import("../runtime/Instance/RoutifyRuntime").RoutifyRuntime | import("../buildtime/RoutifyBuildtime").RoutifyBuildtime> {
    /**
     * @param {string} name
     * @param {MixedModule} module
     * @param {Instance} instance
     */
    constructor(name: string, module: MixedModule, instance: Instance);
    /** @type {Instance} */
    instance: Instance;
    /** @type {RNode} */
    parent: RNode<any>;
    /** @type {Object.<string, any>} */
    meta: {
        [x: string]: any;
    };
    /** @type {String} */
    id: string;
    name: string;
    module: MixedModule;
    /** @param {RNode} child */
    appendChild(child: RNode<any>): void;
    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     * @returns {RNode}
     */
    createChild(name: string, module: any): RNode<any>;
    /** @returns {RNode[]} */
    get descendants(): RNode<any>[];
    remove(): void;
    get ancestors(): RNode<any>[];
    get superNode(): RNode<any>;
    get isSuperNode(): any;
    get root(): RNode<Instance>;
    get isRoot(): boolean;
    /** @returns {RNode[]} */
    get children(): RNode<any>[];
    /** @returns {number} */
    get level(): number;
    /**
     * resolve a node relative to this node
     * @param {string} path
     * @returns
     */
    traverse(path: string): any;
    toJSON(): RNode<Instance> & {
        children: RNode<any>[];
    };
    /** @returns {string} */
    get path(): string;
}

/**
 * @template {RoutifyRuntime|RoutifyBuildtime} Instance
 */
export class RNode<Instance extends import("../runtime/Instance/RoutifyRuntime.js").RoutifyRuntime | import("../buildtime/RoutifyBuildtime.js").RoutifyBuildtime> {
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
    get descendants(): any;
    remove(): void;
    get ancestors(): RNode<any>[];
    get superNode(): any;
    get isSuperNode(): boolean;
    get root(): RNode<Instance>;
    get isRoot(): boolean;
    get children(): any;
    get level(): any;
    traverse(path: any): any;
    toJSON(): RNode<Instance> & {
        children: any[];
    };
    get path(): any;
}

/** @template {import('./Routify').Routify<any>} InstanceType */
export class RNode<InstanceType extends import("./Routify").Routify<any>> {
    /**
     * @param {string} name
     * @param {ReservedCmpProps|string} module
     * @param {InstanceType} instance
     */
    constructor(name: string, module: ReservedCmpProps | string, instance: InstanceType);
    /** @type {InstanceType['NodeType']} */
    parent: InstanceType['NodeType'];
    /** @type {Object.<string, any>} */
    meta: {
        [x: string]: any;
    };
    /** @type {String} */
    id: string;
    /** @type {InstanceType} */
    instance: InstanceType;
    name: string;
    module: string | ReservedCmpProps;
    /** @param {this} child */
    appendChild(child: RNode<InstanceType>): void;
    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     */
    createChild(name: string, module: any): RNode<InstanceType>;
    /** @type {InstanceType['NodeType'][]} */
    get descendants(): InstanceType["NodeType"][];
    remove(): void;
    get ancestors(): RNode<InstanceType>[];
    get root(): RNode<InstanceType>;
    get isRoot(): boolean;
    /** @type {InstanceType['NodeType'][]} */
    get children(): InstanceType["NodeType"][];
    /** @returns {number} */
    get level(): number;
    set regex(arg: RegExp);
    get regex(): RegExp;
    get paramKeys(): string[];
    /**
     * returns parameters for a given urlFragment
     * @param {string} urlFragment
     */
    getParams(urlFragment: string): {};
    /**
     * resolve a node relative to this node
     * @param {string} path
     * @param {boolean} allowDynamic allow traversing dynamic components (parameterized)
     * @param {boolean} includeIndex
     * @param {boolean} silent don't throw errors for 404s
     * @returns {this}
     */
    traverse(path: string, allowDynamic?: boolean, includeIndex?: boolean, silent?: boolean): this;
    /**
     * Returns an array of steps to reach a path. Each path contains a node and params
     * @param {string} path
     * @param {boolean=} allowDynamic
     * @param {boolean=} includeIndex
     * @param {boolean=} silent don't throw errors for 404s
     */
    getChainTo(path: string, allowDynamic?: boolean | undefined, includeIndex?: boolean | undefined, silent?: boolean | undefined): {
        node: RNode<InstanceType>;
        stepsToLeaf: string[];
        params: {};
        fragment: string;
    }[];
    toJSON(): RNode<InstanceType> & {
        children: InstanceType["NodeType"][];
    };
    /** @returns {string} */
    get path(): string;
    #private;
}

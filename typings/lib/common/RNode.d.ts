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
    _cacheByName: {
        <T>(dataProducer: () => T, context: any): T;
        storage: Map<any, any>;
    };
    /** @param {InstanceType['NodeConstructor']['prototype']} child */
    appendChild(child: InstanceType['NodeConstructor']['prototype']): void;
    /**
     * Creates a new child node
     * Same as `node.appendChild(instance.createNode('my-node'))`
     * @param {string} name
     */
    createChild(name: string, module: any): InstanceType["NodeConstructor"]["prototype"];
    /** @type {InstanceType['NodeConstructor']['prototype'][]} */
    get descendants(): InstanceType["NodeConstructor"]["prototype"][];
    remove(): void;
    /** @type {InstanceType['NodeConstructor']['prototype'][]} */
    get ancestors(): InstanceType["NodeConstructor"]["prototype"][];
    /** @type {InstanceType['NodeConstructor']['prototype']} */
    get root(): InstanceType["NodeConstructor"]["prototype"];
    get isRoot(): any;
    /** @type {InstanceType['NodeType'][]} */
    get children(): InstanceType["NodeType"][];
    get navigableChildren(): InstanceType["NodeType"][];
    get linkableChildren(): InstanceType["NodeType"][];
    /** @returns {number} */
    get level(): number;
    _getRegex(): RegExp;
    get regex(): RegExp;
    _getParamKeys(): string[];
    get paramKeys(): string[];
    _getSpecificity(): number[];
    get specificity(): number[];
    /**
     * returns parameters for a given urlFragment
     * @param {string} urlFragment
     */
    getParams(urlFragment: string): {};
    /**
     * resolve a node relative to this node
     * @param {string} path
     * @param {TraverseOptions} [options]
     * @returns {this}
     */
    traverse(path: string, options?: TraverseOptions): this;
    /**
     * Returns an array of steps to reach a path. Each path contains a node and params
     * @param {string} path
     * @param {TraverseOptions} [options]
     */
    getChainTo(path: string, options?: TraverseOptions): {
        node: InstanceType["NodeConstructor"]["prototype"];
        stepsToLeaf: string[];
        params: {};
        fragment: string;
    }[];
    getChainToNode(node: any): any[];
    /**
     * Returns the isDefault child nodes recursively
     * Example: /home -> /home/main -> /home/main/index
     * @param {'children'|'navigableChildren'} childType
     */
    getDefaults(childType?: 'children' | 'navigableChildren'): any[];
    /** @returns {InstanceType['NodeConstructor']['prototype']} */
    toJSON(): InstanceType['NodeConstructor']['prototype'];
    /** @returns {string} */
    get path(): string;
}

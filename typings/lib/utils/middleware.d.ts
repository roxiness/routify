/**
 * Node payload
 */
export type NodePayload = {
    /**
     * current node
     */
    file?: {
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile;
    /**
     * parent of the current node
     */
    parent?: {
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile;
    /**
     * state shared by every node in the walker
     */
    state?: StateObject;
    /**
     * scope inherited by descendants in the scope
    
    State Object
     */
    scope?: any;
};
/**
 * Node payload
 */
export type StateObject = {
    /**
     * payload from the tree
    
    Node walker proxy
     */
    treePayload?: TreePayload;
};
/**
 * Node payload
 */
export type NodeWalkerProxy = (NodePayload: NodePayload) => any;
/**
 * Node payload
 * @typedef {Object} NodePayload
 * @property {RouteNode=} file current node
 * @property {RouteNode=} parent parent of the current node
 * @property {StateObject=} state state shared by every node in the walker
 * @property {Object=} scope scope inherited by descendants in the scope
 *
 * State Object
 * @typedef {Object} StateObject
 * @prop {TreePayload=} treePayload payload from the tree
 *
 * Node walker proxy
 * @callback NodeWalkerProxy
 * @param {NodePayload} NodePayload
 */
/**
 * Node middleware
 * @description Walks through the nodes of a tree
 * @example middleware = createNodeMiddleware(payload => {payload.file.name = 'hello'})(treePayload))
 * @param {NodeWalkerProxy} fn
 */
export function createNodeMiddleware(fn: NodeWalkerProxy): {
    (payload: TreePayload): Promise<NodePayload>;
    /**
     * NodeMiddleware sync payload receiver
     * @param {TreePayload} payload
     */
    sync(payload: TreePayload): NodePayload;
};
/**
 * Node walker
 * @param {Object} file mutable file
 * @param {NodeWalkerProxy} fn function to be called for each file
 * @param {NodePayload=} payload
 */
export function nodeMiddleware(file: any, fn: NodeWalkerProxy, payload?: NodePayload): Promise<NodePayload>;

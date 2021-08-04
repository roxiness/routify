/**
 * Node payload
 */
export type NodePayload = {
    /**
     * current node
     */
    file?: RouteNode | undefined;
    /**
     * parent of the current node
     */
    parent?: RouteNode | undefined;
    /**
     * state shared by every node in the walker
     */
    state?: StateObject | undefined;
    /**
     * scope inherited by descendants in the scope
     *
     * State Object
     */
    scope?: any | undefined;
};
/**
 * Node payload
 */
export type StateObject = {
    /**
     * payload from the tree
     *
     * Node walker proxy
     */
    treePayload?: TreePayload | undefined;
};
/**
 * Node payload
 */
export type NodeWalkerProxy = (NodePayload: NodePayload) => any;
/**
 * Node walker
 * @param {NodeWalkerProxy} fn function to be called for each file
 * @param {NodePayload=} payload
 */
export function nodeMiddleware(fn: NodeWalkerProxy, payload?: NodePayload | undefined): Promise<boolean>;
/**
 * Node walker (sync version)
 * @param {NodeWalkerProxy} fn function to be called for each file
 * @param {NodePayload=} payload
 */
export function nodeMiddlewareSync(fn: NodeWalkerProxy, payload?: NodePayload | undefined): boolean;
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
    (payload: TreePayload): Promise<boolean>;
    /**
     * NodeMiddleware sync payload receiver
     * @param {TreePayload} payload
     */
    sync(payload: TreePayload): boolean;
};

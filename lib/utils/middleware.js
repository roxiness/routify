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
function createNodeMiddleware(fn) {

    /**    
     * NodeMiddleware payload receiver
     * @param {TreePayload} payload
     */
    const inner = async function execute(payload) {
        return await nodeMiddleware(payload.tree, fn, { state: { treePayload: payload } })
    }

    /**    
     * NodeMiddleware sync payload receiver
     * @param {TreePayload} payload
     */
    inner.sync = function executeSync(payload) {
        return nodeMiddlewareSync(payload.tree, fn, { state: { treePayload: payload } })
    }

    return inner
}

/**
 * Node walker
 * @param {Object} file mutable file
 * @param {NodeWalkerProxy} fn function to be called for each file
 * @param {NodePayload=} payload 
 */
async function nodeMiddleware(file, fn, payload) {
    const { state, scope, parent } = payload || {}
    payload = {
        file,
        parent,
        state: state || {},            //state is shared by all files in the walk
        scope: clone(scope || {}),     //scope is inherited by descendants
    }

    await fn(payload)

    if (file.children) {
        payload.parent = file
        await Promise.all(file.children.map(_file => nodeMiddleware(_file, fn, payload)))
    }
    return payload
}

/**
 * Node walker (sync version)
 * @param {Object} file mutable file
 * @param {NodeWalkerProxy} fn function to be called for each file
 * @param {NodePayload=} payload 
 */
function nodeMiddlewareSync(file, fn, payload) {
    const { state, scope, parent } = payload || {}
    payload = {
        file,
        parent,
        state: state || {},            //state is shared by all files in the walk
        scope: clone(scope || {}),     //scope is inherited by descendants
    }

    fn(payload)

    if (file.children) {
        payload.parent = file
        file.children.map(_file => nodeMiddlewareSync(_file, fn, payload))
    }
    return payload
}


/**
 * Clone with JSON
 * @param {T} obj 
 * @returns {T} JSON cloned object
 * @template T
 */
function clone(obj) { return JSON.parse(JSON.stringify(obj)) }



module.exports = { createNodeMiddleware, nodeMiddleware }


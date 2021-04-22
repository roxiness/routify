/**
 * @typedef {import('./common/RNode')['RNode']} RNodeConstructor
 * @typedef {import('./runtime/RNodeRuntime')['RNodeRuntime']} RNodeRuntimeConstructor
 *
 * @typedef {RNodeConstructor['prototype']} RNode
 * @typedef {RNodeRuntimeConstructor['prototype']} RNodeRuntime
 *
 *
 * @typedef {import('./common/Routify')['Routify']['prototype']} Routify
 * @typedef {import('./lib/RoutifyBuildtime')['RoutifyBuildtime']['prototype']} RoutifyBuildtime
 * @typedef {import('./runtime/RoutifyRuntime')['RoutifyRuntime']['prototype']} RoutifyRuntime
 * @typedef {{instance: Routify}} RoutifyPayload
 * @typedef {{instance: RoutifyBuildtime}} RoutifyBuildtimePayload
 * @typedef {{instance: RoutifyRuntime}} RoutifyRuntimePayload
 */

/**
 * @template T
 * @callback RoutifyCallback
 * @param {{instance: Routify}} first
 * @returns {T|Promise<T>}
 */

/**
 * @typedef {Object} RoutifyPlugin
 * @prop {string|string[]=} before name of plugin(s) to run before
 * @prop {string|string[]=} after name of plugin(s) to run after
 * @prop {RoutifyCallback<Boolean>=} condition run plugin if true
 * @prop {RoutifyCallback<any>} run plugin script
 * @prop {'compile'|'runtime'} mode
 */

/**
 * @typedef {Object} PathNode
 * @prop {string} pathFragment
 * @prop {RNodeRuntime} node
 */

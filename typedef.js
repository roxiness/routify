/**
 * @typedef {import('./lib/common/RNode')['RNode']} RNodeConstructor
 * @typedef {RNodeConstructor['prototype']} RNode
 *
 * @typedef {import('./lib/runtime/RNodeRuntime')['RNodeRuntime']} RNodeRuntimeConstructor
 * @typedef {RNodeRuntimeConstructor['prototype']} RNodeRuntime
 *
 * @typedef {import('./lib/runtime/route/Route')['Route']} RouteConstructor
 * @typedef {RouteConstructor['prototype']} Route
 *
 * @typedef {import('./lib/runtime/Router')['Router']} RouterConstructor
 * @typedef {RouterConstructor['prototype']} Router
 *
 * @typedef {import('./lib/runtime/route/RouteFragment')['RouteFragment']} RouteFragmentConstructor
 * @typedef {RouteFragmentConstructor['prototype']} RouteFragment
 *
 * @typedef {import('./lib/runtime/RoutifyRuntime')['RoutifyRuntime']} RoutifyRuntimeConstructor
 * @typedef {RoutifyRuntimeConstructor['prototype']} RoutifyRuntime
 *
 * @typedef {import('./lib/buildtime/RoutifyBuildtime')['RoutifyBuildtime']} RoutifyBuildtimeConstructor
 * @typedef {RoutifyBuildtimeConstructor['prototype']} RoutifyBuildtime
 *
 * @typedef {import('./lib/common/Routify')['Routify']} RoutifyConstructor
 * @typedef {RoutifyConstructor['prototype']} Routify
 *
 *
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
 * @prop {string} urlFragment
 * @prop {RNodeRuntime} node
 */

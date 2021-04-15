/**
 * @typedef {import('./common/Routify')['Routify']['prototype']} Routify
 */

/**
 * @template T
 * @callback RoutifyCallback
 * @param {{instance: Routify}} first
 * @returns {T|Promise<T>}
 */

/**
 * @typedef {Object} RoutifyPlugin
 * @prop {string|string[]=} before
 * @prop {string|string[]=} after
 * @prop {RoutifyCallback<Boolean>=} condition
 * @prop {RoutifyCallback<any>} run
 * @prop {'compile'|'runtime'} mode
 */
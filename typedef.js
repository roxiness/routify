/**
 * @typedef {Object} RoutifyPlugin
 * @prop {string|string[]} before
 * @prop {string|string[]} after
 * @prop {Promise<function():Boolean>} condition
 * @prop {Promise<function():any>} run
 */
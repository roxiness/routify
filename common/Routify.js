import { RNode } from './RNode.js'
import { deepAssign } from './utils.js'
import '../typedef.js'

/**
 * @typedef {Object} RoutifyOptions
 * @prop {string} routifyDir
 * @prop {Partial<FilemapperOptions>} filemapper
 * @prop {(RoutifyPlugin|string)[]} plugins
 */

/**
 * @typedef {Object} FilemapperOptions
 * @prop {String[]} moduleFiles
 * @prop {String[]} resetFiles
 * @prop {Object<string, string>|string} routesDir
 */

export class Routify {
    /** @param {Partial<RoutifyOptions>} options */
    constructor(options) {
        this.options = deepAssign(this.options, options)
        Object.assign(this.plugins, this.options.plugins)
        this.init(options)
    }

    init(options) {}

    /** @type {RNode[]} */
    nodeIndex = []

    createNode(name, component) {
        return new RNode(name, component, this)
    }

    superNode = new RNode('_ROOT', null, this)

    /** @type {Partial<RoutifyOptions>} */
    options = {}

    /** @type {RoutifyPlugin[]} */
    plugins = []
}

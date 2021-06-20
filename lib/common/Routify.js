import { RNode } from './RNode.js'
import { normalizePlugins, sortPlugins } from './utils.js'
import '#root/typedef.js'

/**
 * @typedef {Object} RoutifyOptions
 * @prop {string} routifyDir
 * @prop {Object<string, string>|string} routesDir
 * @prop {Partial<FilemapperOptions>} filemapper
 * @prop {(RoutifyPlugin|string)[]} plugins
 */

/**
 * @typedef {Object} FilemapperOptions
 * @prop {String[]} moduleFiles
 * @prop {String[]} resetFiles
 */

/**
 * @template {RNodeConstructor|RNodeRuntimeConstructor} NodeType
 */
export class Routify {
    /** @type {NodeType} */
    Node = RNode
    /** @type {NodeType['prototype'][]} */
    #nodeIndex = []

    /** @type {NodeType['prototype']} */
    superNode = new this.Node('_ROOT', null, this)

    get nodeIndex() {
        return this.#nodeIndex
    }

    /** @param {Partial<RoutifyOptions>} options */
    constructor(options) {
        /** @type {Partial<RoutifyOptions>} */
        this.options = options

        /** @type {RoutifyPlugin[]} */
        const plugins = normalizePlugins(this.options.plugins || [])
        this.plugins = sortPlugins(plugins)
    }

    /**
     * @param {string} name
     * @param {string} component
     * @returns {NodeType['prototype']}
     */
    createNode(name, component) {
        return new this.Node(name, component, this)
    }
}

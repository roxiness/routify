import { RNode } from './RNode.js'
import { deepAssign, sortPlugins } from './utils.js'
import '#root/typedef.js'

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

/**
 * @template {RNodeConstructor|RNodeRuntimeConstructor} NodeType
 */
export class Routify {
    /** @type {NodeType} */
    Node = RNode
    /** @type {NodeType['prototype'][]} */
    #nodeIndex = []

    superNode = new this.Node('_ROOT', null, this)

    get nodeIndex() {
        return this.#nodeIndex
    }

    /** @param {Partial<RoutifyOptions>} options */
    constructor(options) {
        /** @type {Partial<RoutifyOptions>} */
        this.options = deepAssign({ plugins: [] }, options)

        /** @type {RoutifyPlugin[]} */
        this.plugins = sortPlugins(this.options.plugins.flat())
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

import { RNode } from './RNode.js'
import { deepAssign } from './utils.js'
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

    get nodeIndex() {
        return this.#nodeIndex
    }

    /** @param {Partial<RoutifyOptions>} options */
    constructor(options) {
        this.#options = deepAssign(this.options, options)
        Object.assign(this.plugins, this.options.plugins)
    }

    superNode = new this.Node('_ROOT', null, this)

    /**
     * @param {string} name
     * @param {string} component
     * @returns {NodeType['prototype']}
     */
    createNode(name, component) {
        return new this.Node(name, component, this)
    }

    /** @type {Partial<RoutifyOptions>} */
    #options = {}

    get options() {
        return this.#options
    }

    /** @type {RoutifyPlugin[]} */
    plugins = []
}

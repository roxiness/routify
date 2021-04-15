import { Node } from './Node.js'
import { deepAssign } from './utils.js'

/**
 * @typedef {Object} RoutifyOptions
 * @prop {string} routifyDir
 * @prop {Partial<FilemapperOptions>} filemapper
 */

/**
 * @typedef {Object} FilemapperOptions
 * @prop {String[]} moduleFiles
 * @prop {String[]} resetFiles
 * @prop {Object<string, string>|string} routesDir
 */

export class Routify {
    /** @param {Partial<RoutifyOptions>} options */
    constructor (options) {
        this.options = deepAssign(this.options, options)
    }

    /** @type {Node[]} */
    nodeIndex = []

    createNode (name) {
        return new Node(name, this)
    }

    superNode = new Node('_ROOT', this)

    /** @type {RoutifyOptions} */
    options = {
        routifyDir: '.routify',
        filemapper: {
            moduleFiles: ['_module.svelte', '_reset.svelte'],
            resetFiles: ['_reset.svelte'],
            routesDir: {
                default: 'routes'
            }
        }
    }

    plugins = []
}
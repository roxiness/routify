import { RNode } from './RNode.js'
import { deepAssign, sortPlugins } from './utils.js'
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
    constructor (options) {
        this.options = deepAssign(this.options, options)
        Object.assign(this.plugins, this.options.plugins)
    }

    /** @type {RNode[]} */
    nodeIndex = []

    createNode(name, component) {
        return new RNode(name, component, this)
    }

    superNode = new RNode('_ROOT', null, this)

    /** @type {RoutifyOptions} */
    options = {
        plugins: [],
    }

    /** @type {RoutifyPlugin[]} */
    plugins = []

    async start () {
        this.plugins = this.plugins.filter(
            (plugin) => plugin.mode === 'compile',
        )
        this.plugins = sortPlugins(this.plugins)
        const instance = this
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                (await plugin.condition({ instance }))
            if (shouldRun) await plugin.run({ instance })
        }
    }
}

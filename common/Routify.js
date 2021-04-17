import { Node } from './Node.js'
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
    constructor(options) {
        this.options = deepAssign(this.options, options)
        Object.assign(this.plugins, this.options.plugins)
        // normalize routifyDir
        const { filemapper } = this.options
        if (typeof filemapper.routesDir === 'string')
            filemapper.routesDir = { default: filemapper.routesDir }
    }

    /** @type {Node[]} */
    nodeIndex = []

    createNode(name, component) {
        return new Node(name, component, this)
    }

    superNode = new Node('_ROOT', null, this)

    /** @type {RoutifyOptions} */
    options = {
        routifyDir: '.routify',
        plugins: [],
        filemapper: {
            moduleFiles: ['_module.svelte', '_reset.svelte'],
            resetFiles: ['_reset.svelte'],
            routesDir: {
                default: 'routes',
            },
        },
    }

    /** @type {RoutifyPlugin[]} */
    plugins = []

    async start() {
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

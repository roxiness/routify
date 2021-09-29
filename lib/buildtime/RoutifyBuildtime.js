import { normalizePlugins, sortPlugins, deepAssign } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import {
    hashObj,
    hookHandler,
    resolvePlugins,
    sanitizeConfig,
    split,
    throttle,
} from './utils.js'
import { configent } from 'configent'
import { metaSplitPlugin } from './plugins/metaSplit/index.js'
import fse from 'fs-extra'
import { RNode } from '../common/RNode.js'

const getDefaults = () => ({
    routifyDir: '.routify',
    clearRoutifyDir: true,
    filemapper: {
        moduleFiles: ['_module', '_reset'],
        resetFiles: ['_reset'],
        fallbackFiles: ['_fallback'],
    },
    routesDir: {
        default: 'src/routes',
    },
    extensions: ['.svelte', '.html', '.md', '.svx'],
    plugins: [
        filemapperPlugin,
        metaFromFilePlugin,
        bundlerPlugin,
        metaSplitPlugin,
        exporterPlugin,
        watcherPlugin,
    ],
    watch: false,
})

export class RoutifyBuildtime {
    mode = 'buildtime'

    Node = RNode

    /** @type {RNodeBuildtime[]} */
    nodeIndex = []

    /** @type {RoutifyBuildtimePlugin[]} */
    plugins = []

    superNode = new this.Node('_ROOT', null, this)

    /**
     * @param {string} name
     * @param {string|any} module
     * @returns {RNode<this>}
     */
    createNode(name, module) {
        return new this.Node(name, module, this)
    }

    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options) {
        const config = deepAssign(
            {},
            getDefaults(),
            configent({ name: 'routify' }),
            options,
        )

        this.options = sanitizeConfig(config)

        // normalize routifyDir
        if (typeof this.options.routesDir === 'string')
            this.options.routesDir = { default: options.routesDir }

        // clear dir
        // todo jest doesn't like this one
        if (this.options.clearRoutifyDir) fse.removeSync(this.options.routifyDir)

        const _build = this.#build.bind(this)
        this.build = async trigger => await throttle(() => _build(trigger))
    }

    on = {
        buildStart: hookHandler(),
        buildComplete: hookHandler(),
        fileAdded: hookHandler(),
        fileRemoved: hookHandler(),
        fileChanged: hookHandler(),
        fileWatcherReady: hookHandler(),
    }

    async #build(trigger) {
        console.log('[Routify 3] build triggered by', trigger)
        const instance = this
        this.on.buildStart.runHooks()
        this.nodeIndex.splice(0)

        const tools = {
            split: split(this.options.routifyDir),
            hashObj,
        }

        /** @type {RoutifyBuildtimePlugin[]} */
        const plugins = normalizePlugins(await resolvePlugins(this.options.plugins || []))
        this.plugins = sortPlugins(plugins)
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                (await plugin.condition({ instance }))
            if (shouldRun) {
                const { options } = plugin
                await plugin.build({ instance, options, tools })
            }
        }

        this.on.buildComplete.runHooks()
    }

    start() {
        return this.#build('initial')
    }
}

/**
 * @typedef {Object} RoutifyOptions
 * @prop {string} routifyDir
 * @prop {Object<string, string>|string} routesDir
 * @prop {Partial<FilemapperOptions>} filemapper
 */

/**
 * @typedef {Object} FilemapperOptions
 * @prop {String[]} moduleFiles
 * @prop {String[]} resetFiles
 */

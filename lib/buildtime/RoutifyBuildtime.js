import { normalizePlugins, sortPlugins, deepAssign } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import { hashObj, hookHandler, resolvePlugins, split, throttle } from './utils.js'
import { configent } from 'configent'
import { metaSplitPlugin } from './plugins/metaSplit/index.js'
import fse from 'fs-extra'
import { Routify } from '../common/Routify.js'
import { RNodeBuildtime } from './RNodeBuildtime.js'

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

/**
 *  @extends {Routify<typeof import('./RNodeBuildtime')['RNodeBuildtime']>}
 **/
export class RoutifyBuildtime extends Routify {
    Node = RNodeBuildtime
    mode = 'buildtime'

    /** @type {RoutifyBuildtimePlugin[]} */
    plugins = []

    /** @type {Function} */
    close

    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options) {
        super({ Node: RNodeBuildtime })
        const config = deepAssign(
            {},
            getDefaults(),
            configent({ name: 'routify' }),
            /** @ts-ignore deepAssign thinks its too different */
            options,
        )

        this.options = config

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

        const resolvedPlugins = await resolvePlugins(this.options.plugins || [])
        const plugins = normalizePlugins(resolvedPlugins)
        this.plugins = sortPlugins(plugins)
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                (await plugin.condition({ instance }))
            if (shouldRun) {
                await plugin.build({ instance, tools })
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

import { resolve } from 'path'
import { normalizePlugins, sortPlugins, deepAssign, throttle } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { namedModulePlugin } from './plugins/namedModule/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import {
    getSvelteVersion,
    hashObj,
    resolvePlugins,
    split,
    writeFileIfDifferent,
} from './utils.js'
import { configent } from 'configent'
import { metaSplitPlugin } from './plugins/metaSplit/index.js'
import { metaPersistPlugin } from './plugins/metaPersist/index.js'
import fse from 'fs-extra'
import { Routify } from '../common/Routify.js'
import { RNodeBuildtime } from './RNodeBuildtime.js'
import { createParallelHooksCollection } from 'hookar'
import { devHelperPlugin } from './plugins/devHelper/helper.js'
import { metaCapturePlugin } from './plugins/metaCapture/index.js'
import { log, logs } from './logMsgs.js'
import { omitDirFromPathPlugin } from './plugins/omitFromPath/index.js'
import { themesPlugin } from './plugins/themes/index.js'

/** @returns {Partial<RoutifyBuildtimeOptions>} */
const getDefaults = () => ({
    routifyDir: '.routify',
    clearRoutifyDir: true,
    mainEntryPoint: 'src/main.js',
    rootComponent: 'src/App.svelte',
    filemapper: {
        moduleFiles: ['_module', '_reset'],
        resetFiles: ['_reset'],
        fallbackFiles: ['_fallback'],
    },
    themes: { presets: {} },
    logLevel: 3,
    routesDir: {
        default: 'src/routes',
    },
    extensions: ['.svelte', '.html', '.md', '.svx'],
    ignoreMetaConflictWarnings: [],
    plugins: [
        filemapperPlugin,
        metaFromFilePlugin,
        bundlerPlugin,
        metaSplitPlugin,
        metaPersistPlugin,
        namedModulePlugin,
        exporterPlugin,
        watcherPlugin,
        devHelperPlugin,
        metaCapturePlugin,
        omitDirFromPathPlugin,
        themesPlugin,
    ],
    svelteApi: getSvelteVersion().startsWith('5') ? 5 : 4,
    watch: false,
})

/**
 * @returns {RoutifyBuildtimeOptions}
 */
const getConfigentOptions = () =>
    configent({
        name: 'routify',
        consumerDir: import.meta.url,
    })

/**
 * @extends {Routify<typeof RNodeBuildtime>}
 */
export class RoutifyBuildtime extends Routify {
    NodeConstructor = RNodeBuildtime
    mode = 'buildtime'

    /** @type {RoutifyBuildtimePlugin[]} */
    plugins = []

    /** @type {Function} */
    close

    /** @type {Object<string, RNodeBuildtime>} */
    rootNodes = {}

    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options) {
        super()
        this.options = deepAssign({}, getDefaults(), getConfigentOptions(), options)

        log.level = Number(this.options.logLevel)

        // clear dir
        // todo jest doesn't like this one
        if (this.options.clearRoutifyDir) fse.removeSync(this.options.routifyDir)

        const _build = this.build.bind(this)
        this.build = async trigger => await throttle(() => _build(trigger))
    }

    on = {
        buildStart: createParallelHooksCollection(),
        buildComplete: createParallelHooksCollection(),
        fileAdded: createParallelHooksCollection(),
        fileRemoved: createParallelHooksCollection(),
        fileChanged: createParallelHooksCollection(),
        fileWatcherReady: createParallelHooksCollection(),
    }

    /**
     *
     * @param {string} id filename
     * @param {string} content
     * @param {{cwd?: string}} options
     */
    async writeFile(id, content, options = {}) {
        const transforms = this.plugins.map(p => p.transform).filter(Boolean)

        for (const transform of transforms)
            content = (await transform(id, content, this)) || content

        const cwd = options.cwd != null ? options.cwd : this.options.routifyDir
        const path = resolve(cwd, id)

        await writeFileIfDifferent(path, content)
    }

    async build(trigger) {
        const time = Date.now()

        const instance = this
        await this.on.buildStart.run()
        this.nodeIndex.splice(0)

        const tools = {
            split: split(this.options.routifyDir),
            hashObj,
            log,
        }

        const resolvedPlugins = await resolvePlugins(this.options.plugins || [])
        const plugins = normalizePlugins(resolvedPlugins)
        this.plugins = sortPlugins(plugins)

        logs.buildTimePluginsList(this.plugins)

        for (const plugin of this.plugins)
            if (plugin.options) this.options = await plugin.options(this.options)

        for (const plugin of this.plugins)
            if (plugin.build) await plugin.build({ instance, tools })

        await this.on.buildComplete.run()

        logs.buildTime(trigger, time)
    }

    start() {
        return this.build('init')
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

import { normalizePlugins, sortPlugins, deepAssign } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import {
    hashObj,
    resolvePlugins,
    split,
    throttle,
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

/** @returns {Partial<RoutifyBuildtimeOptions>} */
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
        metaPersistPlugin,
        exporterPlugin,
        watcherPlugin,
        devHelperPlugin,
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

    /** @type {Object<string, RNodeBuildtime>} */
    rootNodes = {}

    /** @param {Partial<RoutifyBuildtimeOptions>} options */
    constructor(options) {
        super()
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

    async writeFile(id, content) {
        const transforms = this.plugins.map(p => p.transform).filter(Boolean)

        for (const transform of transforms)
            content = (await transform(id, content, this)) || content

        await writeFileIfDifferent(id, content)
    }

    async build(trigger) {
        console.log('[Routify 3] build triggered by', trigger)
        const instance = this
        await this.on.buildStart.run()
        this.nodeIndex.splice(0)

        const tools = {
            split: split(this.options.routifyDir),
            hashObj,
        }

        const resolvedPlugins = await resolvePlugins(this.options.plugins || [])
        const plugins = normalizePlugins(resolvedPlugins)
        this.plugins = sortPlugins(plugins)

        for (const plugin of this.plugins)
            if (plugin.options) this.options = await plugin.options(this.options)

        for (const plugin of this.plugins)
            if (plugin.build) await plugin.build({ instance, tools })

        await this.on.buildComplete.run()
    }

    start() {
        return this.build('initial')
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

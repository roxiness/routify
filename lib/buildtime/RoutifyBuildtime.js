import '#root/typedef.js'
import { Routify } from '../common/Routify.js'
import { normalizePlugins, sortPlugins, deepAssign } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import { hookHandler, resolvePlugins } from './utils.js'
import { configent } from 'configent'
import { metaSplitPlugin } from './plugins/metaSplit/index.js'

const getDefaults = () => ({
    routifyDir: '.routify',
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
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
 * @extends {Routify<RNodeConstructor>}
 */
export class RoutifyBuildtime extends Routify {
    constructor(options) {
        const config = deepAssign(
            {},
            getDefaults(),
            configent({ name: 'routify' }),
            options,
        )
        super(config)

        // todo jest doesn't like this one
        // fse.rmdirSync(config.routifyDir, { recursive: true })

        // normalize routifyDir
        if (typeof this.options.routesDir === 'string')
            this.options.routesDir = { default: options.routesDir }
    }

    on = {
        buildStart: hookHandler(),
        buildComplete: hookHandler(),
        fileAdded: hookHandler(),
        fileRemoved: hookHandler(),
        fileChanged: hookHandler(),
        fileWatcherReady: hookHandler(),
    }

    async build() {
        const instance = this
        this.on.buildStart.runHooks()
        this.nodeIndex.splice(0)

        /** @type {RoutifyBuildtimePlugin[]} */
        const plugins = normalizePlugins(await resolvePlugins(this.options.plugins || []))
        this.plugins = sortPlugins(plugins)
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                (await plugin.condition({ instance }))
            if (shouldRun) await plugin.build({ instance })
        }
        this.on.buildComplete.runHooks()
    }

    start = this.build
}

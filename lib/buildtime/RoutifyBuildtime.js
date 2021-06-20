import { Routify } from '../common/Routify.js'
import { deepAssign } from '../common/utils.js'
import { bundlerPlugin } from './plugins/bundler/index.js'
import { exporterPlugin } from './plugins/exporter/index.js'
import { filemapperPlugin } from './plugins/filemapper/index.js'
import { metaFromFilePlugin } from './plugins/metaFromFile/index.js'
import { watcherPlugin } from './plugins/watcher/index.js'
import { hookHandler } from './utils.js'
import { configent } from 'configent'

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
        exporterPlugin,
        watcherPlugin,
    ],
    watch: false,
})

export class RoutifyBuildtime extends Routify {
    constructor(options) {
        const config = configent({ name: 'routify' })
        super(deepAssign({}, getDefaults(), config, options))
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
        this.on.buildStart.runHooks()
        this.nodeIndex.splice(0)

        const instance = this
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

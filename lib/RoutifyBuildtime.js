import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { bundlerPlugin } from '../plugins/bundler/index.js'
import { exporterPlugin } from '../plugins/exporter/index.js'
import { filemapperPlugin } from '../plugins/filemapper/index.js'
import { metaFromFilePlugin } from '../plugins/metaFromFile/index.js'

const getDefaults = () => ({
    routifyDir: '.routify',
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
        routesDir: {
            default: 'src/routes',
        }
    },
    plugins: []
})


export class RoutifyBuildtime extends Routify {
    constructor (options) {
        super(deepAssign({}, getDefaults(), options))

        // normalize routifyDir
        const { filemapper } = this.options
        if (typeof filemapper.routesDir === 'string')
            filemapper.routesDir = { default: filemapper.routesDir }
    }

    plugins = [
        filemapperPlugin,
        metaFromFilePlugin,
        bundlerPlugin,
        exporterPlugin,
    ]

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
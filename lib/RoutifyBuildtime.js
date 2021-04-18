import { Routify } from '../common/Routify.js'
import { deepAssign } from '../common/utils.js'
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
            default: 'routes',
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
}

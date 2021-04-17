import { Routify } from '../common/Routify.js'
import { bundlerPlugin } from '../plugins/bundler/index.js'
import { exporterPlugin } from '../plugins/exporter/index.js'
import { filemapperPlugin } from '../plugins/filemapper/index.js'
import { metaFromFilePlugin } from '../plugins/metaFromFile/index.js'

export class RoutifyBuildtime extends Routify {
    plugins = [
        filemapperPlugin,
        metaFromFilePlugin,
        bundlerPlugin,
        exporterPlugin,
    ]
}

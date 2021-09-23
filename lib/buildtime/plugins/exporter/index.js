import '../../../../typedef.js'
import { exporter } from './exporter.js'

/** @type {RoutifyBuildtimePlugin} */
export const exporterPlugin = {
    name: 'exporter',
    after: 'filemapper',
    build: exporter,
}

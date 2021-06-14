import '#root/typedef.js'
import { exporter } from './exporter.js'

/** @type {RoutifyPlugin} */
export const exporterPlugin = {
    after: 'filemapper',
    build: exporter,
}

import '#root/typedef.js'
import { exporter } from './exporter.js'

/** @type {RoutifyPlugin} */
export const exporterPlugin = {
    condition: () => true,
    after: 'filemapper',
    mode: 'compile',
    run: exporter,
}

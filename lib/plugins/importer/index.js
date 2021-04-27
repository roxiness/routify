import '../../../typedef.js'
import { importer } from './importer.js'

/** @type {RoutifyPlugin} */
export const importerPlugin = {
    condition: ({ instance }) => instance.options.routes,
    mode: 'runtime',
    run: importer,
}

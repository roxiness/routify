import '../../typedef.js'
import { importer } from './importer.js'

/** @type {RoutifyPlugin} */
export const importerPlugin = {
    condition: () => true,
    mode: 'runtime',
    run: importer,
}

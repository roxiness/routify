import '../../typedef.js'
import { filemapper } from './lib/index.js'

/** @type {RoutifyPlugin} */
export const filemapperPlugin = {
    condition: () => true,
    after: 'filemapper',
    mode: 'compile',
    run: filemapper,
}

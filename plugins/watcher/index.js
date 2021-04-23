import '../../typedef.js'
import { watcher } from './watcher.js'

/** @type {RoutifyPlugin} */
export const watcherPlugin = {
    condition: () => true,
    after: 'watcher',
    mode: 'compile',
    run: watcher,
}

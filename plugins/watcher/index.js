import '../../typedef.js'
import { watcher } from './watcher.js'

/** @type {RoutifyPlugin} */
export const watcherPlugin = {
    condition: ({ instance }) => instance.options.watch,
    after: 'watcher',
    mode: 'compile',
    run: watcher,
}

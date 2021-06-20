import '#root/typedef.js'
import { watcher } from './watcher.js'

/** @type {RoutifyBuildtimePlugin} */
export const watcherPlugin = {
    after: 'watcher',
    build: watcher,
}

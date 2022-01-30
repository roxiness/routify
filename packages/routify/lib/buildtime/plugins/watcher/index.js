import { watcher } from './watcher.js'

/** @type {RoutifyBuildtimePlugin} */
export const watcherPlugin = {
    build: watcher,
    name: 'watcher',
}

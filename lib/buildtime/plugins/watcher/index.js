import '#root/typedef.js'
import { watcher } from './watcher.js'

/** @type {RoutifyPlugin} */
export const watcherPlugin = {
    after: 'watcher',
    build: watcher,
}

import { filemapper } from './lib/index.js'

/** @type {RoutifyBuildtimePlugin} */
export const filemapperPlugin = {
    name: 'filemapper',
    build: filemapper,
}

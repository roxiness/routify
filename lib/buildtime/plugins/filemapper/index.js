import '#root/typedef.js'
import { filemapper } from './lib/index.js'

/** @type {RoutifyPlugin} */
export const filemapperPlugin = {
    after: 'filemapper',
    build: filemapper,
}

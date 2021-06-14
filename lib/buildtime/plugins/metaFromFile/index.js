import '#root/typedef.js'
import { metaFromFile } from './metaFromFile.js'

/** @type {RoutifyPlugin} */
export const metaFromFilePlugin = {
    after: 'filemapper',
    build: metaFromFile,
}

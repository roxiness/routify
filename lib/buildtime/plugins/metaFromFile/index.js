import { metaFromFile } from './metaFromFile.js'

/** @type {RoutifyBuildtimePlugin} */
export const metaFromFilePlugin = {
    name: 'metaFromFile',
    after: 'filemapper',
    build: metaFromFile,
}

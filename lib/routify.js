import { Routify } from '../common/Routify.js'
import { filemapperPlugin } from '../plugins/filemapper/index.js'
import { metaFromFilePlugin } from '../plugins/metaFromFile/index.js'


export default new Routify({
    plugins: [
        filemapperPlugin,
        metaFromFilePlugin,
    ]
})

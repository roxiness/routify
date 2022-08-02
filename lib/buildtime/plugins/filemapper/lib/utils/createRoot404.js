import { createDirname } from '../../../../utils.js'
import { File } from '../File.js'
import fse from 'fs-extra'

const __dirname = createDirname(import.meta)

/** @param {RNode} rootNode */
export const createRoot404 = (rootNode, routifyDir) => {
    const path = routifyDir + '/components/[...404].svelte'
    if (!fse.existsSync(path)) fse.copySync(__dirname + '/[...404].svelte', path)

    if (!rootNode.children.find(node => node.meta.dynamicSpread)) {
        const file = new File(path)
        const node = rootNode.createChild(file.name, './' + path)
        node.file = file
        node.meta = { dynamic: true, dynamicSpread: true }
    }
}

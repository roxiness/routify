import { RNode } from '../../../../common/RNode.js' //eslint-disable-line
import fse from 'fs-extra'
import { relative, resolve } from 'path'
import { File } from '../File.js'

/**
 * Maps filestructure to a node tree
 * @param {RNode} firstNode the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<RNode>}
 */
export async function createNodesFromFiles(firstNode, path) {
    firstNode.file = new File(path)
    const queue = [firstNode]

    let node

    while ((node = queue.pop())) {
        const relativePath = relative(node.root.file.path, node.file.path)
        // set id to `default_path_to_file` if rootName is default
        node.id =
            '_' +
            [node.root.rootName, relativePath]
                .filter(Boolean)
                .join('_')
                .replace(/[^\w]/g, '_')

        if (node.file.stat.isDirectory()) {
            // for each child create a node, attach a file and add it to the queue
            const children = await fse.readdir(node.file.path)
            const promises = children.map((filename) => {
                const file = new File(resolve(node.file.path, filename))
                const component = !file.stat.isDirectory() && file.path
                const childNode = node.createChild(file.name, component)
                childNode.file = file
                queue.unshift(childNode)
            })
            await Promise.all(promises)
        }
    }
    return firstNode
}

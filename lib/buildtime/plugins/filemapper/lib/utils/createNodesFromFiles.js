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
        const relativePath = relative(node.superNode.file.path, node.file.path)
        // set id to `default_path_to_file` if rootName is default
        node.id =
            '_' +
            [node.superNode.rootName, relativePath]
                .filter(Boolean)
                .join('_')
                .replace(/[^\w]/g, '_')

        if (node.file.stat.isDirectory()) {
            // for each child create a node, attach a file and add it to the queue
            const children = await fse.readdir(node.file.path)
            const promises = children.map(filename => {
                const file = new File(resolve(node.file.path, filename))
                if (
                    file.stat.isDirectory() ||
                    firstNode.instance.options.extensions.includes(file.ext)
                ) {
                    const module = !file.stat.isDirectory() && file.path
                    const childNode = node.createChild(file.name, module)
                    childNode.file = file
                    queue.unshift(childNode)
                }
            })
            await Promise.all(promises)
        }
    }
    return firstNode
}
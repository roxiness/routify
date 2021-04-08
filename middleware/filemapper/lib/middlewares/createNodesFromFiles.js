import { Node } from "../../../../lib/node.js";
import { readdir } from 'fs/promises'
import { relative, resolve } from "path";
import { File } from "../File.js";

/**
 * Maps filestructure to a node tree
 * @param {Node} firstNode the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<Node>}
 */
export async function createNodesFromFiles(firstNode, path) {
    const { instance } = firstNode
    firstNode.file = new File(path)
    const queue = [firstNode]


    let node

    while (node = queue.pop()) {
        node.file.relative = relative(firstNode.file.path, node.file.path) // todo is not including filename
        node.id = node.file.relative.replace(/[^\w]/g, '_')
        
        if (node.file.stat.isDirectory()) {
            // for each child create a node, attach a file and add it to the queue
            const children = await readdir(node.file.path)
            const promises = children.map(filename => {
                const file = new File(resolve(node.file.path, filename))
                const childNode = instance.createNode(file.name)
                childNode.file = file
                node.appendChild(childNode)
                queue.unshift(childNode)
            })
            await Promise.all(promises)
        }

    }
    return firstNode
}
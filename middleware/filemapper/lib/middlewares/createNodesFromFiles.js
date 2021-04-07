import { Node } from "../../../../lib/node.js";
import { readdir } from 'fs/promises'
import { relative, resolve } from "path";
import { File } from "../File.js";

/**
 * Maps filestructure to a node tree
 * @param {Node} node the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<Node>}
 */
export async function createNodesFromFiles(node, path) {
    const { instance } = node

    const queue = [{ path, node }]

    while (queue.length) {
        const { node, path } = queue.pop()
        node.file = new File(path)
        const children = await readdir(path)

        const promises = children.map(filename => {
            const filepath = resolve(path, filename)
            const file = new File(filepath)
            file.relative = relative(node.root.file.path, node.file.path)
            const childNode = instance.createNode(file.name)
            childNode.file = file
            node.appendChild(childNode)
            if (file.stat.isDirectory())
                queue.unshift({ node: childNode, path: file.path })
        })

        await Promise.all(promises)
    }

    return node
}

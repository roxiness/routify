import { Node } from "../../../../lib/node.js";
import { readdir } from 'fs/promises'
import { resolve } from "path";
import { File } from "../File.js";

/**
 * Maps filestructure to a node tree
 * @param {Node} node
 * @param {String} path
 * @return {Promise<Node>}
 */
export async function filemapper(node, path) {
    const { instance } = node

    const queue = [{ path, node }]

    while (queue.length) {
        const { node, path } = queue.pop()
        node.file = new File(path)
        const children = await readdir(path)

        const promises = children.map(filename => {
            const filepath = resolve(path, filename)
            const file = new File(filepath)
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

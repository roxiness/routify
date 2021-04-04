import { Node } from "../../../../lib/Node.js";
import { readdir } from 'fs/promises'
import { resolve } from "path";
import { File } from "../File.js";


/**
 * Maps filestructure to a node tree
 * @param {string} path 
 * @param {Node} parentNode 
 */
export const filemapper = async (parentNode, path) => {
    if (!parentNode)
        throw new Error('parentNode is missing')
    const filenames = await readdir(path)
    const promises = filenames.map(filename => {
        const filepath = resolve(path, filename)
        const file = new File(filepath)
        const node = new Node(file.name)
        node.file = file
        parentNode.appendChild(node)
        if (file.stat.isDirectory())
            return filemapper(node, file.path)
    })
    await Promise.all(promises)
    return parentNode
}
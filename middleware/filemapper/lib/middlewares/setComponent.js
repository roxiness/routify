import { Node } from "../../../../lib/node.js"
import { nameFilter } from "../../utils.js";

/**
 * set component for nodes that have a file prop
 * @param {Node} rootNode 
 */
export const setComponent = (rootNode) => {
    rootNode.nodeIndex
        .filter(node => node.file && !node.file.stat.isDirectory())
        .forEach(node => node.component = node.file.path)
}
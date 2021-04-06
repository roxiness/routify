import { Node } from "../../../../lib/Node.js"
import { nameFilter } from "../../utils.js";

/**
 * set component (svelte file) for nodes that have a file prop
 * @param {Node} rootNode 
 */
export const setComponent = (rootNode) => {
    rootNode.instance.nodeIndex
        .filter(node => node.file && !node.file.stat.isDirectory())
        .forEach(node => node.component = node.file.path)
}
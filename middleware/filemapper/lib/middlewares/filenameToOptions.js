import { Node } from "../../../../lib/Node.js"
import { nameFilter } from "../../utils.js";

/**
 * assign reset, fallback and dynamic paths
 * @param {Node} rootNode 
 */
export const filenameToOptions = (rootNode) => {
    rootNode.nodeIndex
        .filter(nameFilter(['_reset.svelte']))
        .forEach(node => node.meta.reset = true)

    rootNode.nodeIndex
        .filter(nameFilter(['_fallback.svelte']))
        .forEach(node => node.meta.fallback = true)

    rootNode.nodeIndex
        .filter(node => node.file.name.match(/\[.+\]/))
        .forEach(node => {
            node.meta.dynamic = true
            // node.name = node.name.replace(/\[([^\[\]]+)\]/g, `:$1`)
        })
}
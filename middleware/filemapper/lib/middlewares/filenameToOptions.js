import { Node } from "../../../../lib/Node.js"
import { nameFilter } from "../../utils.js";

/**
 * assign reset, fallback and dynamic paths
 * @param {Node} rootNode 
 */
export const filenameToOptions = (rootNode) => {
    const { nodeIndex } = rootNode.instance

    // set meta.reset for _reset.svelte
    nodeIndex
        .filter(nameFilter(['_reset.svelte']))
        .forEach(node => node.meta.reset = true)

    // set meta.fallback for _fallback.svelte
    nodeIndex
        .filter(nameFilter(['_fallback.svelte']))
        .forEach(node => node.meta.fallback = true)

    // set meta.dynamic for files with attribute in name
    nodeIndex
        .filter(node => node.file && node.file.name.match(/\[.+\]/))
        .forEach(node => node.meta.dynamic = true)
}
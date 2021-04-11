import { Node } from "../../../../lib/Node.js"
import { nameFilter } from "../../utils.js";

/**
 * assign reset, fallback and dynamic paths to node.meta
 * @param {Node} node 
 */
export const filenameToOptions = (node) => {
    const { descendants } = node

    // set meta.reset for _reset.svelte
    descendants
        .filter(nameFilter(['_reset.svelte']))
        .forEach(node => node.meta.reset = true)

    // set meta.fallback for _fallback.svelte
    descendants
        .filter(nameFilter(['_fallback.svelte']))
        .forEach(node => node.meta.fallback = true)

    // set meta.dynamic for files with attribute in name
    descendants
        .filter(node => node.file && node.file.name.match(/\[.+\]/))
        .forEach(node => node.meta.dynamic = true)
}
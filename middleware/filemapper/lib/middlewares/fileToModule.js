import { Node } from "../../../../lib/node.js"
import { nameFilter } from "../../utils.js";


/**
 * for nodes that have a _module.svelte or _reset.svelte file,
 * `file` is moved to node.parent and the old node is removed
 * @param {Node} rootNode 
 */
export const moveModuleToParentNode = (rootNode, moduleFiles) => {
    rootNode.nodeIndex
        .filter(nameFilter(moduleFiles))
        .forEach(node => {
            node.parent.file = node.file
            node.parent.meta = { ...node.parent.meta, ...node.meta }
            node.remove()
        })
}
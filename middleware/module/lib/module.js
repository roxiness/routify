import { Node } from "../../../lib/node.js"
import { sep } from "path";

/**
 * 
 * @param {Node} node 
 */
export const moveModuleToParentNode = (node) => {
    node.children.forEach((childNode, index) => {
        if (childNode.file.path.split(sep).pop() === '_module.svelte')
            node.file = node.children.splice(index, 1)[0].file
        else
            moveModuleToParentNode(childNode)
    })
}
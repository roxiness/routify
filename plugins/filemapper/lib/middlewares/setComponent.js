// Node needed for typed JS
import { Node } from '../../../../lib/Node.js' //eslint-disable-line

/**
 * set component (svelte file) for nodes that have a file prop
 * @param {Node} node
 */
export const setComponent = (node) => {
    [node, ...node.descendants]
        .filter(node => node.file && !node.file.stat.isDirectory())
        .forEach(node => node.component = node.file.path)
}
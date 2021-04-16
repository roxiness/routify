/**
 * Maps filestructure to a node tree
 * @param {Node} firstNode the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<Node>}
 */
export function createNodesFromFiles(firstNode: Node, path: string): Promise<Node>;
import { Node } from "../../../../common/Node.js";

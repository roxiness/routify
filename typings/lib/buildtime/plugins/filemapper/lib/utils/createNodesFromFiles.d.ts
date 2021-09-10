/**
 * Maps filestructure to a node tree
 * @param {RNode} firstNode the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<RNode>}
 */
export function createNodesFromFiles(firstNode: import("../../../../../common/RNode.js").RNode<any>, path: string): Promise<import("../../../../../common/RNode.js").RNode<any>>;

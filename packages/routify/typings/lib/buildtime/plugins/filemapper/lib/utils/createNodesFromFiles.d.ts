/**
 * Maps filestructure to a node tree
 * @param {RNodeBuildtime} firstNode the root node of the specified path
 * @param {String} path dir to scan for files
 * @return {Promise<RNodeBuildtime>}
 */
export function createNodesFromFiles(firstNode: RNodeBuildtime, path: string): Promise<RNodeBuildtime>;

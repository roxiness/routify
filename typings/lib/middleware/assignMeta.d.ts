/**
 * parses .svelte files for metadata and adds it to its respective node
 **/
export const applyMetaToFiles: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
/**
 * propagate inheritable metadata to descendent nodes. $$bundleId etc.
 * @param {TreePayload} treePayload
 */
export function applyMetaToTree(treePayload: TreePayload): never;

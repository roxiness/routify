export const applyMetaToFiles: {
    (payload: TreePayload): Promise<import("../utils/middleware").NodePayload>;
    sync(payload: TreePayload): import("../utils/middleware").NodePayload;
};
/**
 *
 * @param {TreePayload} treePayload
 */
export function applyMetaToTree(treePayload: TreePayload): {
    [x: string]: any;
} & MiscFile & GeneratedFile & DefinedFile;
/**
 *
 * @param {TreePayload} payload
 */
export function defineDefaultMeta(payload: TreePayload): void;

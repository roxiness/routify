export const addPath: {
    (payload: TreePayload): Promise<import("../utils/middleware").NodePayload>;
    sync(payload: TreePayload): import("../utils/middleware").NodePayload;
};
export const addId: {
    (payload: TreePayload): Promise<import("../utils/middleware").NodePayload>;
    sync(payload: TreePayload): import("../utils/middleware").NodePayload;
};
export const removeUnderscoredDirs: {
    (payload: TreePayload): Promise<import("../utils/middleware").NodePayload>;
    sync(payload: TreePayload): import("../utils/middleware").NodePayload;
};
export function removeNonSvelteFiles(payload: any): void;
export const defineFiles: {
    (payload: TreePayload): Promise<import("../utils/middleware").NodePayload>;
    sync(payload: TreePayload): import("../utils/middleware").NodePayload;
};

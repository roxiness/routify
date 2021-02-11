export const addPath: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const addId: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const removeUnderscoredDirs: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export function removeNonSvelteFiles(payload: any): void;
export const defineFiles: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};

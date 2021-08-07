export const addPath: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const addId: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const removeUnderscoredDirs: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export function removeNonSvelteFiles(payload: any): void;
export const defineFiles: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};

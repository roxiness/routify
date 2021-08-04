export const setRegex: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const setParamKeys: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const setShortPath: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const setRank: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const addMetaChildren: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const setIsIndexable: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const assignRelations: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const assignIndex: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export const assignLayout: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};
export function createFlatList(treePayload: any): void;
export const setPrototype: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};

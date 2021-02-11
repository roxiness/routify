export const setRegex: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const setParamKeys: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const setShortPath: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const setRank: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const addMetaChildren: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const setIsIndexable: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const assignRelations: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const assignIndex: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export const assignLayout: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};
export function createFlatList(treePayload: any): void;
export const setPrototype: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};

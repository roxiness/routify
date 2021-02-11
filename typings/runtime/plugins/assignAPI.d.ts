export const assignAPI: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};

export const attachComponent: {
    (payload: TreePayload): Promise<any>;
    sync(payload: TreePayload): any;
};

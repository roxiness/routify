export const attachComponent: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};

export const assignAPI: {
    (payload: TreePayload): Promise<boolean>;
    sync(payload: TreePayload): boolean;
};

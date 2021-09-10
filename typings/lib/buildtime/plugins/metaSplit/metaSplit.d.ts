export function metaSplit({ instance }: {
    instance: any;
}): Promise<void>;
export type MetaObject = {
    value: Function;
    split?: boolean;
    scoped?: boolean;
};

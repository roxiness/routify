declare function _default(): Promise<{
    prop: string;
    nested: {
        nestedProp: string;
    };
    'codesplitted|split': string;
    explicit: {
        value: string;
    };
    explicitSplit: {
        value: string;
        split: boolean;
    };
}>;
export default _default;

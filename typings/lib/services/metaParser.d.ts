declare function _exports({ cache: useCache }?: {
    cache: any;
}): {
    get: (file: any) => Promise<{}>;
    fileChange: (file: any) => Promise<"new" | "uncached" | "changed" | "unchanged">;
    deleteFile: (file: any) => boolean;
};
export = _exports;

declare function _exports({ cache: useCache }?: {
    cache: any;
}): {
    get: (file: any) => Promise<{}>;
    hasMetaChanged: (file: any) => Promise<boolean>;
    deleteFile: (file: any) => boolean;
};
export = _exports;

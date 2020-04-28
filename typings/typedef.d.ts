/**
 * //  * @typedef {import("svelte/store").Readable<{component: RouteNode}>} ContextStore
 */
type SvelteComponent = import("svelte").SvelteComponent;
/**
 * ClientNode
 */
type ClientNode = {
    [x: string]: any;
} & DefinedFile & ClientNodeSpecifics;
/**
 * ClientNode
 */
type ClientNodeSpecifics = {
    layouts: ({
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics)[];
    parent: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
    nextSibling: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
    prevSibling: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
    lineage: ({
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics)[];
    ext: string;
    meta: Meta;
    id: string;
    path: string;
    shortPath: string;
    ranking: string;
    isIndexable: boolean;
    isNonIndexable: boolean;
    paramKeys: string[];
    regex: string;
    component: () => import("svelte").SvelteComponent | Promise<import("svelte").SvelteComponent>;
    last: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
    api: ClientNodeApi;
};
/**
 * ClientNodeApi
 */
type ClientNodeApi = {
    parent: ClientNodeApi;
    next: ClientNodeApi;
    prev: ClientNodeApi;
    children: ClientNodeApi[];
    isMeta: boolean;
    path: string;
    title: string;
    meta: Meta;
    __file: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
};
/**
 * File
 */
type RouteNode = {
    [x: string]: any;
} & MiscFile & GeneratedFile & DefinedFile;
/**
 * File
 */
type DefinedFile = {
    isFile?: boolean;
    isDir?: boolean;
    isPage?: boolean;
    isLayout?: boolean;
    isReset?: boolean;
    isIndex?: boolean;
    isFallback?: boolean;
};
/**
 * File
 */
type GeneratedFile = {
    name: string;
    path: string;
    dir?: ({
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile)[];
    absolutePath: string;
    isFile: string;
    filepath: string;
    ext: string;
    badExt: boolean;
};
/**
 * File
 */
type MiscFile = {
    id: string;
    getParent: () => {
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile;
    parent: {
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile;
    meta: Meta;
};
/**
 * File
 */
type GetParentFile = () => {
    [x: string]: any;
} & MiscFile & GeneratedFile & DefinedFile;
type Meta = {
    /**
     * Bundle with main app
     */
    preload?: boolean;
    "precache-order"?: any;
    "precache-proximity"?: any;
    recursive?: boolean;
    /**
     * Bundle folder recursively in a single .js file
     */
    bundle?: boolean;
    /**
     * Position among siblings
     */
    index?: string | number | false;
    /**
     * Custom identifier
     */
    name?: string;
    /**
     * Title of the page
     */
    title?: string;
    children?: MetaChild[];
    $$bundleId?: string;
};
type MetaChild = {
    title?: string;
    path?: string;
    children?: MetaChild[];
};
/**
 * Tree Payload
 */
type TreePayload = {
    routes: ({
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile)[];
    tree: {
        [x: string]: any;
    } & MiscFile & GeneratedFile & DefinedFile;
    options: BuildConfig;
    metaParser: any;
    defaultMeta: any;
};
/**
 * Build Config
 */
type BuildConfig = {
    pages?: string;
    routifyDir?: string;
    dynamicImports?: boolean;
    singleBuild?: boolean;
    distDir?: string;
    extensions?: string | any[];
    ignore?: string | any[];
    noHashScroll?: boolean;
};
type UrlParams = {
    [x: string]: any;
};
type UrlOptions = {
    strict?: boolean;
};
type GotoOptions = {
    /**
     * preserve filename in url, ie. /index
     */
    strict?: boolean;
    /**
     * use replaceState instead pushState
     */
    redirect?: boolean;
    /**
     * render url without redirecting
     */
    static?: boolean;
    /**
     * use the current layouts instead of those of the target
     */
    shallow?: boolean;
};
type IsActiveOptions = {
    strict?: boolean;
};
type ConcestorReturn = [ClientNodeApi, ClientNodeApi, ClientNodeApi];

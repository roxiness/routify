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
    layouts: ClientNode[];
    parent: ClientNode | undefined;
    nextSibling: ClientNode | undefined;
    prevSibling: ClientNode | undefined;
    lineage: ClientNode[];
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
    component: () => SvelteComponent | Promise<SvelteComponent>;
    last: ClientNode;
    api: ClientNodeApi;
};
/**
 * ClientNodeApi
 */
type ClientNodeApi = {
    parent: ClientNodeApi | undefined;
    next: ClientNodeApi | undefined;
    prev: ClientNodeApi | undefined;
    children: ClientNodeApi[];
    isMeta: boolean;
    path: string;
    title: string;
    meta: Meta;
    __file: ClientNode;
};
/**
 * File
 */
type RouteNode = never;
/**
 * File
 */
type DefinedFile = {
    isFile?: boolean | undefined;
    isDir?: boolean | undefined;
    isPage?: boolean | undefined;
    isLayout?: boolean | undefined;
    isReset?: boolean | undefined;
    isIndex?: boolean | undefined;
    isFallback?: boolean | undefined;
};
/**
 * File
 */
type GeneratedFile = {
    name: string;
    path: string;
    dir?: RouteNode[] | undefined;
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
    getParent: GetParentFile;
    parent: RouteNode;
    meta: Meta;
};
/**
 * File
 */
type GetParentFile = () => RouteNode;
type Meta = {
    [x: string]: any;
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
    routes: RouteNode[];
    tree: RouteNode;
    options: BuildConfig;
    metaParser: any;
    defaultMeta: any;
};
/**
 * Build Config
 */
type BuildConfig = {
    pages?: string | undefined;
    routifyDir?: string | undefined;
    dynamicImports?: boolean | undefined;
    singleBuild?: boolean | undefined;
    distDir?: string | undefined;
    extensions?: (string | Array) | undefined;
    ignore?: (string | Array) | undefined;
    noHashScroll?: boolean | undefined;
};
type UrlParams = {
    [x: string]: any;
};
type UrlOptions = {
    strict?: boolean | undefined;
};
type GotoOptions = {
    /**
     * preserve filename in url, ie. /index
     */
    strict?: boolean | undefined;
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
    strict?: boolean | undefined;
};
type ConcestorReturn = [ClientNodeApi, ClientNodeApi, ClientNodeApi];

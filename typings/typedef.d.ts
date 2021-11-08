/**
 * COMMON
 */
type RNode = import("./lib/common/RNode").RNode<any>;
/**
 * COMMON
 */
type Routify = import("./lib/common/Routify").Routify<any>;
/**
 * RUNTIME
 */
type RoutifyBaseOptions = {
    Node: import("./lib/common/RNode").RNode<any>;
};
/**
 * COMMON
 */
type RoutifyRuntimePayload = {
    instance: RoutifyRuntime;
};
/**
 * COMMON
 */
type RNodeRuntime = import('./lib/runtime/Instance/RNodeRuntime').RNodeRuntime;
/**
 * COMMON
 */
type Route = import('./lib/runtime/route/Route').Route;
/**
 * COMMON
 */
type Router = import('./lib/runtime/Router/Router').Router;
/**
 * COMMON
 */
type RouteFragment = import('./lib/runtime/route/RouteFragment').RouteFragment;
/**
 * BUILDTIME
 */
type RoutifyRuntime = import('./lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime;
/**
 * COMMON
 */
type RFile = import('./lib/buildtime/plugins/filemapper/lib/File').File;
/**
 * COMMON
 */
type RoutifyBuildtime = import('./lib/buildtime/RoutifyBuildtime').RoutifyBuildtime;
/**
 * COMMON
 */
type RNodeBuildtime = import('./lib/buildtime/RNodeBuildtime').RNodeBuildtime;
/**
 * // todo tools should not be any
 */
type RoutifyBuildtimePayload = {
    instance: RoutifyBuildtime;
    tools: any;
};
type RoutifyCallback<T> = (first: {
    instance: import("./lib/common/Routify").Routify<any>;
}) => T | Promise<T>;
type RoutifyBuildtimeOptions = {
    Node: RNodeBuildtime;
    /**
     * defaults to '.routify'
     */
    routifyDir: string;
    clearRoutifyDir: boolean;
    filemapper: {
        moduleFiles: string[];
        resetFiles: string[];
        fallbackFiles: string[];
    };
    /**
     * defaults to { default: 'src/routes' }
     */
    routesDir: string | {
        [x: string]: string;
    };
    /**
     * defaults to ['.svelte', '.html', '.md', '.svx'],
     */
    extensions: (string | RegExp)[];
    plugins: string[] | any[];
    /**
     * rebuild Routify routes on changes
     */
    watch: boolean;
};
type RoutifyRuntimeOptions = {
    init: (arg0: RoutifyRuntime) => void;
    urlRewrite: UrlRewrite | UrlRewrite[];
    queryHandler: QueryHandler | QueryHandler[];
    beforeRouteChange: Function;
    afterRouteChange: Function;
};
type RoutifyExternalMetaHelper = {
    instance: RoutifyRuntime;
    /**
     * //todo
     */
    options: any;
    tempPath: string;
};
type RoutifyLoad = (context: RoutifyLoadContext) => any;
type RoutifyLoadContext = {
    route: Route;
    node: RNodeRuntime;
};
type RoutifyRuntimePlugin = RoutifyBasePlugin & RoutifyRuntimeOptions;
type RoutifyBuildtimePlugin = RoutifyBasePlugin & RoutifyBuildtimePluginType;
type RoutifyBasePlugin = {
    /**
     * name of plugin
     */
    name?: string | undefined;
    /**
     * name of plugin(s) to run before
     */
    before?: (string | string[]) | undefined;
    /**
     * name of plugin(s) to run after
     */
    after?: (string | string[]) | undefined;
};
type RoutifyBuildtimePluginType = {
    build?: ((arg0: RoutifyBuildtimePayload) => (Promise<any> | any)) | undefined;
    path?: string | undefined;
    meta?: RoutifyExternalMetaHelper | undefined;
    metaContext?: (context: MetaContext & {
        [x: string]: any;
    }) => MetaContext;
    condition?: (RoutifyBuildtimePayload: any) => boolean;
};
type MetaContextSplit = (value: any, name?: string | undefined) => any;
/**
 * Modify the context available to meta files
 */
type MetaContext = {
    instance: RoutifyBuildtime;
    node: RNodeBuildtime;
    options: Partial<RoutifyBuildtimeOptions>;
    /**
     * dynamically import the value
     */
    split?: MetaContextSplit | undefined;
    /**
     * persist the return of a callback on disk. Return persisted data on subsequent calls
     */
    persist?: Persist | undefined;
    /**
     * temporary path for the respective file, eg. ./.routify/cached/src/routes/index.svelte/
     */
    tempPath: string;
};
type UrlRewriteFn = (url: string, ctx: {
    router: Router;
}) => string;
type UrlRewrite = {
    toInternal: UrlRewriteFn;
    toExternal: UrlRewriteFn;
};
type QueryHandler = {
    parse: QueryHandlerParse;
    stringify: QueryHandlerStringify;
};
type QueryHandlerParse = (search: string) => {
    [x: string]: string;
};
type QueryHandlerStringify = (search: {
    [x: string]: string;
}) => string;
type ComponentGuardFn = (route: Route) => any;
type ComponentPreloadFn = () => any;
type RerservedCmpProps = {
    guard?: ComponentGuardFn | undefined;
    preload?: ComponentPreloadFn | undefined;
};
type Module = RerservedCmpProps & {
    [x: string]: any;
};
type MixedModule = any;
type PathNode = {
    urlFragment: string;
    node: RNodeRuntime;
};
type UrlState = 'pushState' | 'replaceState' | 'popState';
type FragmentContext = {
    route: Route;
    node: RNodeRuntime;
    /**
     * preload functionality for pages and modules
     */
    load?: Function | undefined;
    localParams: {
        [x: string]: any;
    };
};
type NodeTreeExport = {
    id: string;
    name?: string | undefined;
    module: any;
    rootName?: string | undefined;
    file?: any | undefined;
    children: NodeTreeExport[];
};
type BrowserAdapter = {
    /**
     * Called by each router when the browser URL changes. Returns an internal URL for each respective router.
     */
    toRouter: (browserUrl: string, router: Router) => string;
    /**
     * compiles all router URLS into a single URL for the browser.
     */
    toBrowser: (routers: Router[]) => string;
};

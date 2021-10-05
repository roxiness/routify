/**
 * RUNTIME
 */
type RNode = import('./lib/common/RNode').RNode;
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
type RNodeBuildtime = RNode & {
    file: RFile;
};
/**
 * // todo tools should not be any
 */
type RoutifyBuildtimePayload = {
    instance: RoutifyBuildtime;
    tools: any;
};
type RoutifyCallback<T> = (first: {
    instance: any;
}) => T | Promise<T>;
type RoutifyBuildtimeOptions = {
    /**
     * defaults to '.routify'
     */
    routifyDir: string;
    clearRoutifyDir: boolean;
    filemapper: {
        moduleFiles: string[];
        resetFiles: string[];
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
    extensions: string[];
    plugins: string[] | any[];
    /**
     * rebuild Routify routes on changes
     */
    watch: boolean;
};
type RoutifyRuntimeOptions = {
    init: (arg0: RoutifyRuntime) => void;
    urlTransform: UrlTransform | UrlTransform[];
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
    }) => {};
};
type MetaContext = {
    instance: RoutifyBuildtime;
    node: RNodeBuildtime;
    options: RoutifyBuildtimeOptions;
    split: (value: any, name?: string) => {};
    tempPath: string;
};
type UrlTransformFn = (url: string) => string;
type UrlTransform = {
    toInternal: UrlTransformFn;
    toExgternal: UrlTransformFn;
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
type MixedModule = Module & Function;
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

/**
 * COMMON
 */
type RNode = import("../lib/common/RNode").RNode<any>;
/**
 * COMMON
 */
type Routify = import("../lib/common/Routify").Routify<any>;
/**
 * RUNTIME
 */
type RoutifyBaseOptions = {
    Node: import("../lib/common/RNode").RNode<any>;
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
type RNodeRuntime = import('../lib/runtime/Instance/RNodeRuntime').RNodeRuntime;
/**
 * COMMON
 */
type Route = import('../lib/runtime/route/Route').Route;
/**
 * COMMON
 */
type Router = import('../lib/runtime/Router/Router').Router;
/**
 * COMMON
 */
type RouteFragment = import('../lib/runtime/route/RouteFragment').RouteFragment;
/**
 * BUILDTIME
 */
type RoutifyRuntime = import('../lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime;
/**
 * COMMON
 */
type RFile = import('../lib/buildtime/plugins/filemapper/lib/File').File;
/**
 * COMMON
 */
type RoutifyBuildtime = import('../lib/buildtime/RoutifyBuildtime').RoutifyBuildtime;
/**
 * COMMON
 */
type RNodeBuildtime = import('../lib/buildtime/RNodeBuildtime').RNodeBuildtime;
/**
 * // todo tools should not be any
 */
type RoutifyBuildtimePayload = {
    instance: RoutifyBuildtime;
    tools: any;
};
type RoutifyCallback<T> = (first: {
    instance: import("../lib/common/Routify").Routify<any>;
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
    /**
     * instance to use. Uses global by default
     */
    instance: RoutifyRuntime;
    rootNode: RNodeRuntime;
    /**
     * the routes tree
     */
    routes: any;
    /**
     * name of router - leave blank if only only one router is used
     */
    name: string;
    /**
     * hook: transforms paths to and from router and browser
     */
    urlRewrite: UrlRewrite | UrlRewrite[];
    /**
     * where to store the URL state - browser by default
     */
    urlReflector: typeof import("../lib/runtime/Router/urlReflectors/ReflectorBase.js")['BaseReflector'];
    /**
     * initial url - "/" by default
     */
    url?: string | undefined;
    /**
     * ignore clicks
     */
    passthrough: boolean | Router;
    /**
     * hook: runs before each router initiation
     */
    beforeRouterInit: MaybeArray<RouterInitCallback>;
    /**
     * hook: runs after each router initiation
     */
    afterRouterInit: MaybeArray<RouterInitCallback>;
    /**
     * hook: guard that runs before url changes
     */
    beforeUrlChange: MaybeArray<BeforeUrlChangeCallback>;
    /**
     * hook: runs after url has changed
     */
    afterUrlChange: MaybeArray<AfterUrlChangeCallback>;
    /**
     * hook: transform route fragments after navigation
     */
    transformFragments: MaybeArray<TransformFragmentsCallback>;
    /**
     * hook: runs before router is destroyed
     */
    onDestroy: MaybeArray<OnDestroyRouterCallback>;
    queryHandler: QueryHandler;
    plugins: Partial<RoutifyRuntimeOptions>[];
};
/**
 * <T>
 */
type Readable<T> = import("svelte/store").Readable<any>;
type RouteStore = import('../lib/runtime/utils/index.js').Getable<Route>;
type RouterInitCallback = (arg0: {
    router: Router;
    firstInit: boolean;
}) => any;
type BeforeUrlChangeCallback = (arg0: {
    route: Route;
}) => any;
type AfterUrlChangeCallback = (arg0: {
    route: Route;
    history: Route[];
}) => any;
type TransformFragmentsCallback = (arg0: RouteFragment[]) => RouteFragment[];
type OnDestroyRouterCallback = (arg0: {
    router: typeof this;
}) => void;
type RoutifyExternalMetaHelper = {
    instance: RoutifyRuntime;
    /**
     * //todo
     */
    options: any;
    tempPath: string;
};
type RoutifyLoad = (context: RoutifyLoadContext) => MaybePromise<Partial<RoutifyLoadReturn> | null>;
type RoutifyLoadContext = {
    route: Route;
    node: RNodeRuntime;
};
type RoutifyLoadReturn = {
    status: number;
    error: string | Error;
    redirect: string;
    maxage: number;
    props: object;
};
type RoutifyBuildtimeRuntimePlugin = {
    /**
     * example: '@roxi/routify/plugins/reset'
     */
    path: string;
    /**
     * the imported name from the path, defaults to "default"
     */
    importee: string;
    /**
     * options passed to the runtime plugin
     */
    options: object;
};
type RoutifyRuntimePlugin = Partial<RoutifyRuntimeOptions>;
type RoutifyBuildtimePlugin = Partial<RoutifyBasePlugin & RoutifyBuildtimePluginType>;
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
    /**
     * runs before "build"
     */
    options: (arg0: Partial<RoutifyBuildtimeOptions>) => Partial<RoutifyBuildtimeOptions>;
};
type RoutifyBuildtimePluginType = {
    /**
     * runs after "options"
     */
    build?: ((arg0: RoutifyBuildtimePayload) => (Promise<any> | any)) | undefined;
    path?: string | undefined;
    meta?: RoutifyExternalMetaHelper | undefined;
    /**
     * provides context to *.meta.js files
     */
    metaContext?: (context: MetaContext & {
        [x: string]: any;
    }) => MetaContext;
    /**
     * transform output files
     */
    transform?: (id: string, content: string, instance: RoutifyBuildtime) => string;
    runtimePlugins: RoutifyBuildtimeRuntimePlugin[];
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
    persist?: typeof import("persistable")['default']['call'] | undefined;
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
type QueryHandlerParse = (search: string, route: Route) => {
    [x: string]: string;
};
type QueryHandlerStringify = (search: {
    [x: string]: string;
}, route: Route) => string;
type ComponentGuardFn = (route: Route) => any;
type RerservedCmpProps = {
    guard?: ComponentGuardFn | undefined;
    load?: RoutifyLoad | undefined;
    default?: import('svelte/types/runtime').SvelteComponent | undefined;
};
type Module = RerservedCmpProps & {
    [x: string]: any;
};
type LoadSvelteModule = () => RerservedCmpProps;
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

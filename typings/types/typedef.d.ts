/**
 * COMMON
 */
type RNode = import("../lib/common/RNode").RNode<any>;
/**
 * COMMON
 */
type Routify = import("../lib/common/Routify").Routify<any>;
/**
 * COMMON
 */
type RoutifyBaseOptions = {
    Node: import("../lib/common/RNode").RNode<any>;
};
/**
 * COMMON
 */
type SvelteComponentDev = typeof import('svelte/internal').SvelteComponentDev;
/**
 * <T>
 */
type MaybeArray<T> = import('./utils').MaybeArray<T>;
/**
 * <T>
 */
type MaybePromise<T> = import('./utils').MaybePromise<T>;
/**
 * RUNTIME
 */
type scrollBoundary = HTMLElement | ((HTMLElement) => HTMLElement) | ((HTMLElement) => Promise<HTMLElement>);
/**
 * RUNTIME
 */
type RoutifyRuntimePayload = {
    instance: RoutifyRuntime;
};
/**
 * RUNTIME
 */
type RNodeRuntime = import('../lib/runtime/Instance/RNodeRuntime').RNodeRuntime;
/**
 * RUNTIME
 */
type Route = import('../lib/runtime/Route/Route').Route;
/**
 * RUNTIME
 */
type Router = import('../lib/runtime/Router/Router').Router;
/**
 * RUNTIME
 */
type RouteFragment = import('../lib/runtime/Route/RouteFragment').RouteFragment;
/**
 * RUNTIME
 */
type RoutifyRuntime = import('../lib/runtime/Instance/RoutifyRuntime').RoutifyRuntime;
/**
 * RUNTIME
 */
type DEPRECATED_RoutifyContext = RenderContext & {
    load: Partial<RoutifyLoadReturn>;
    route: Route;
};
/**
 * RUNTIME
 */
type RoutifyContext = RenderContext;
/**
 * RUNTIME
 */
type RenderContext = import('../lib/runtime/renderer/RenderContext').RenderContext;
/**
 * RUNTIME
 */
type RouterContext = import('../lib/runtime/renderer/RenderContext').RouterContext;
/**
 * RUNTIME
 */
type AnchorLocation = import('../lib/runtime/decorators/AnchorDecorator').Location;
/**
 * BUILDTIME
 */
type ScrollContext = import('../lib/runtime/plugins/scroller/ScrollContext').ScrollContext;
/**
 * RUNTIME
 */
type RFile = import('../lib/buildtime/plugins/filemapper/lib/File').File;
/**
 * RUNTIME
 */
type RoutifyBuildtime = import('../lib/buildtime/RoutifyBuildtime').RoutifyBuildtime;
/**
 * RUNTIME
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
    /**
     * defaults to 'src/main.js'
     */
    mainEntryPoint: string;
    /**
     * defaults to 'src/App.svelte'
     */
    rootComponent: string;
    /**
     * defaults to { default: 'src/routes' }
     */
    routesDir: string | {
        [x: string]: string;
    };
    ignoreMetaConflictWarnings: string[] | boolean;
    filemapper: object;
    /**
     * defaults to 3
     */
    logLevel: 1 | 2 | 3 | 4 | 5;
    /**
     * defaults to ['_module.svelte', '_reset.svelte']
     */
    moduleFiles: string[];
    /**
     * defaults to ['_reset.svelte']
     */
    resetFiles: string[];
    /**
     * defaults to ['_reset.svelte']
     */
    fallbackFiles: string[];
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
     * hook: runs after a new route has been rendered
     */
    afterRouteRendered: MaybeArray<AfterRouteRenderedCallback>;
    /**
     * hook: transform route fragments after navigation
     */
    transformFragments: MaybeArray<TransformFragmentsCallback>;
    /**
     * hook: runs when the router is mounted
     */
    onMount: MaybeArray<OnMountRouterCallback>;
    /**
     * hook: runs before router is destroyed
     */
    onDestroy: MaybeArray<OnDestroyRouterCallback>;
    /**
     * how to handle trailing slashes, defaults to 'never'
     */
    trailingSlash: 'always' | 'never' | 'preserve' | 'contextual';
    queryHandler: QueryHandler;
    plugins: Partial<RoutifyRuntimeOptions>[];
    clickHandler: ClickHandler;
    /**
     * where to place the anchor element
     */
    anchor: AnchorLocation;
};
type DecoratorInput<T> = (Partial<Decorator<T>> & {
    component: SvelteComponentDev;
}) | SvelteComponentDev;
type Decorator<T> = {
    recursive?: boolean | undefined;
    shouldRender?: ((payload: DecoratorShouldRenderPayload<T>) => boolean) | undefined;
    component: SvelteComponentDev;
    order: number;
    props: T;
};
type DecoratorShouldRenderPayload<T> = {
    context: RenderContext;
    /**
     * ,
     */
    root: boolean;
    decorators: Decorator<T>;
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
type AfterRouteRenderedCallback = (arg0: {
    route: Route;
}) => void;
type OnUrlClickCallback = (arg0: HTMLAnchorElement) => any;
type TransformFragmentsCallback = (arg0: RouteFragment[]) => RouteFragment[];
type OnMountRouterCallback = (arg0: {
    router: Router;
    context: {
        decorators: any[];
    };
}) => void;
type OnDestroyRouterCallback = (arg0: {
    router: Router;
}) => void;
type RoutifyExternalMetaHelper = {
    instance: RoutifyRuntime;
    /**
     * //todo
     */
    options: any;
    tempPath: string;
};
type RoutifyLoad = RoutifyLoadAsync | RoutifyLoadSync;
type RoutifyLoadSync = (context: RoutifyLoadContext) => Partial<RoutifyLoadReturn> | null;
type RoutifyLoadAsync = (context: RoutifyLoadContext) => Promise<Partial<RoutifyLoadReturn> | null>;
type RoutifyLoadContext = {
    route: Route;
    url: import('../lib/runtime').Url;
    prevRoute?: Route | undefined;
    isNew: boolean;
    fetch: typeof fetch;
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
    reservedMetaKeys: string[];
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
    split: MetaContextSplit;
    /**
     * persist the return of a callback on disk. Return persisted data on subsequent calls
     */
    persist: typeof import("persistable")['default']['call'];
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
type ClickHandler = {
    callback?: ((event: MouseEvent | KeyboardEvent, url: string) => string | false) | undefined;
    elem?: (HTMLElement | ((elem: HTMLElement) => HTMLElement)) | undefined;
};
type ComponentGuardFn = (route: Route) => any;
type ReservedCmpProps = {
    guard?: ComponentGuardFn | undefined;
    load?: RoutifyLoad | undefined;
    default?: SvelteComponentDev | undefined;
};
type Module = ReservedCmpProps & {
    [x: string]: any;
};
type LoadSvelteModule = () => (Promise<ReservedCmpProps>);
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
type SvelteComponentTyped = import('svelte').SvelteComponentTyped;
type InlineInput = Partial<Inline> | boolean;
type Inline = {
    /**
     * return true to inline the child node
     */
    isInline: (node: RNodeRuntime, context: RenderContext) => boolean;
    /**
     * return true to inline the child node
     */
    shouldScroll: InlineCallback<boolean>;
    context: 'browser' | 'ssr' | 'always';
    scrollIntoView: (elem: HTMLElement, instant: boolean, options: any) => void;
    params: {
        [x: string]: string[];
    };
    wrapper: SvelteComponentDev | null;
};
type DeferredPromise<T> = Promise<T> & {
    resolve: (T) => void;
    reject: (T) => void;
};
type InlineCallback<T> = (context: ScrollContext, index: number, allScrollContexts: ScrollContext[], defaultCb?: InlineCallback<T>) => T;
type RenderContextOptions = Partial<{
    inline: InlineInput;
    decorator: DecoratorInput<any>;
    props;
    options;
    anchor: AnchorLocation;
    scrollBoundary: scrollBoundary;
}>;
type TraverseOptions = {
    /**
     * allow traversing dynamic components (parameterized)
     */
    allowDynamic?: boolean;
    /**
     * include index components in the chain
     */
    includeIndex?: boolean;
    /**
     * only traverse children that are not marked as noRoute
     */
    navigableChildrenOnly?: boolean;
    /**
     * false: throw errors for 404s, true: don't throw errors for 404s, 'report': log errors for 404s
     */
    silent?: boolean | 'report';
    /**
     * the root node to start traversing from
     */
    rootNode?: import("../lib/common/RNode").RNode<any>;
};

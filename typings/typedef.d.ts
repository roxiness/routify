/**
 * RUNTIME
 */
type RNode = import("./lib/common/RNode").RNode<any>;
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
type RNodeBuildtime = import('./lib/common/RNode').RNode<RoutifyBuildtime>;
/**
 * COMMON
 */
type RoutifyBuildtime = import('./lib/buildtime/RoutifyBuildtime').RoutifyBuildtime;
/**
 * COMMON
 */
type RoutifyBuildtimePayload = {
    instance: RoutifyBuildtime;
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
    build?: ((arg0: {
        instance: RoutifyBuildtime;
    }) => (Promise<any> | any)) | undefined;
    path?: string | undefined;
    meta?: RoutifyExternalMetaHelper | undefined;
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

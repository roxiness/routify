/**
 * @implements { Readable<Router> }
 */
export class Router implements Readable<Router> {
    /**
     * @param {Partial<RouterOptions>} options
     */
    constructor(options: Partial<RouterOptions>);
    /** @type { RouteStore } */
    pendingRoute: RouteStore;
    /** @type { RouteStore } */
    activeRoute: RouteStore;
    /** @type {UrlRewrite[]} */
    urlRewrites: UrlRewrite[];
    /** @type { import('hookar').HooksCollection<BeforeUrlChangeCallback> } */
    beforeUrlChange: import('hookar').HooksCollection<BeforeUrlChangeCallback>;
    /** @type { import('hookar').HooksCollection<AfterUrlChangeCallback> } */
    afterUrlChange: import('hookar').HooksCollection<AfterUrlChangeCallback>;
    /** @type { import('hookar').HooksCollection<TransformFragmentsCallback> } */
    transformFragments: import('hookar').HooksCollection<TransformFragmentsCallback>;
    /** @type { import('hookar').HooksCollection<OnDestroyRouterCallback> } */
    onDestroy: import('hookar').HooksCollection<OnDestroyRouterCallback>;
    parentElem: any;
    queryHandler: {
        parse: (search: any) => any;
        stringify: (params: any) => string;
    };
    scrollHandler: {
        isScrolling: import("svelte/store").Writable<boolean>;
        run: AfterUrlChangeCallback;
    };
    url: {
        internal: () => string;
        external: () => string;
        getActive: () => string;
        getPending: () => string;
        toString: () => string;
        set: (url: string, mode: UrlState, isInternal?: boolean) => Promise<true | false>;
        push: (url: any) => Promise<boolean>;
        replace: (url: any) => Promise<boolean>;
        pop: (url: any) => Promise<boolean>;
    };
    ready: Promise<any>;
    /** @type {Route[]} */
    history: Route[];
    subscribe: (this: void, run: import("svelte/store").Subscriber<Router>, invalidate?: (value?: Router) => void) => import("svelte/store").Unsubscriber;
    triggerStore: () => void;
    params: import("svelte/store").Readable<any>;
    /**
     * @param {Partial<RouterOptions>} options
     */
    init(options: Partial<RouterOptions>): void;
    /** @type {RoutifyRuntime} */
    instance: RoutifyRuntime;
    name: string;
    log: any;
    passthrough: any;
    parentCmpCtx: any;
    /** @type {RNodeRuntime} */
    rootNode: RNodeRuntime;
    setParentElem: (elem: any) => any;
    importRoutes(routes: any): void;
    /**
     * converts a URL or Routify's internal URL to an external URL (for the browser)
     * @param {string=} url
     * @returns
     */
    getExternalUrl: (url?: string | undefined) => string;
    /**
     * converts an external URL (from the browser) to an internal URL
     * @param {string} url
     * @returns
     */
    getInternalUrl: (url: string) => string;
    /**
     *
     * @param {string} url
     * @param {UrlState} mode pushState, replaceState or popState
     * @param {boolean} [isInternal=false] if the URL is already internal, skip rewrite.toInternal
     * @returns {Promise<true|false>}
     */
    _setUrl(url: string, mode: UrlState, isInternal?: boolean): Promise<true | false>;
    destroy(): void;
    /** @type {BaseReflector} */
    get urlReflector(): BaseReflector;
    /** @param {typeof BaseReflector} UrlReflector */
    setUrlReflector(UrlReflector: typeof BaseReflector): void;
    #private;
}
export function createRouter(options: Partial<RouterOptions>): Router;
/**
 * <T>
 */
export type Readable<T> = import("svelte/store").Readable<any>;
export type RouteStore = import('../utils/index.js').Getable<Route>;
export type BeforeUrlChangeCallback = (arg0: {
    route: Route;
}) => any;
export type AfterUrlChangeCallback = (arg0: {
    route: Route;
    history: Route[];
}) => any;
export type TransformFragmentsCallback = (arg0: RouteFragment[]) => RouteFragment[];
export type OnDestroyRouterCallback = (arg0: {
    router: typeof this;
}) => void;
export type RouterOptions = {
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
    urlReflector: typeof BaseReflector;
    /**
     * initial url - "/" by default
     */
    url: string;
    /**
     * ignore clicks
     */
    passthrough: boolean | typeof Router;
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
    plugins: RouterOptions[];
};
export type ParentCmpCtx = {
    route: Route;
    node: RNodeRuntime;
    localParams: any;
    options: any;
};
export type RouterOptionsNormalizedOverlay = {
    /**
     * hook: transforms paths to and from router and browser
     */
    urlRewrite: UrlRewrite[];
    /**
     * hook: guard that runs before url changes
     */
    beforeUrlChange: BeforeUrlChangeCallback[];
    /**
     * hook: runs after url has changed
     */
    afterUrlChange: AfterUrlChangeCallback[];
    /**
     * hook: transform route fragments after navigation
     */
    transformFragments: TransformFragmentsCallback[];
    /**
     * hook: runs before router is destroyed
     */
    onDestroy: OnDestroyRouterCallback[];
};
export type RouterOptionsNormalized = RouterOptions & RouterOptionsNormalizedOverlay;
import { Route } from "../Route/Route.js";
import { RoutifyRuntime } from "../Instance/RoutifyRuntime.js";
import { BaseReflector } from "./urlReflectors/ReflectorBase.js";

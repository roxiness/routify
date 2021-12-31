/**
 * @implements { Readable<Router> }
 */
export class Router implements Readable<Router> {
    /**
     * @param {Partial<RoutifyRuntimeOptions>} input
     */
    constructor(input: Partial<RoutifyRuntimeOptions>);
    /** @type { RouteStore } */
    pendingRoute: RouteStore;
    /** @type { RouteStore } */
    activeRoute: RouteStore;
    /** @type {UrlRewrite[]} */
    urlRewrites: UrlRewrite[];
    /** @type { import('hookar').HooksCollection<RouterInitCallback> } */
    beforeRouterInit: import('hookar').HooksCollection<RouterInitCallback>;
    /** @type { import('hookar').HooksCollection<RouterInitCallback> } */
    afterRouterInit: import('hookar').HooksCollection<RouterInitCallback>;
    /** @type { import('hookar').HooksCollection<BeforeUrlChangeCallback> } */
    beforeUrlChange: import('hookar').HooksCollection<BeforeUrlChangeCallback>;
    /** @type { import('hookar').HooksCollection<AfterUrlChangeCallback> } */
    afterUrlChange: import('hookar').HooksCollection<AfterUrlChangeCallback>;
    /** @type { import('hookar').HooksCollection<TransformFragmentsCallback> } */
    transformFragments: import('hookar').HooksCollection<TransformFragmentsCallback>;
    /** @type { import('hookar').HooksCollection<OnDestroyRouterCallback> } */
    onDestroy: import('hookar').HooksCollection<OnDestroyRouterCallback>;
    parentElem: any;
    /** @type {QueryHandler} */
    queryHandler: QueryHandler;
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
     * @param {Partial<RoutifyRuntimeOptions>} input
     */
    init(input: Partial<RoutifyRuntimeOptions>): void;
    /** @type {Partial<RouterOptionsNormalized>} */
    options: Partial<RouterOptionsNormalized>;
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
export function createRouter(options: Partial<RoutifyRuntimeOptions>): Router;
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
     * hook: runs before each router initiation
     */
    beforeRouterInit: RouterInitCallback[];
    /**
     * hook: runs after each router initiation
     */
    afterRouterInit: RouterInitCallback[];
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
export type RouterOptionsNormalized = RoutifyRuntimeOptions & RouterOptionsNormalizedOverlay;
import { Route } from "../Route/Route.js";
import { RoutifyRuntime } from "../Instance/RoutifyRuntime.js";
import { BaseReflector } from "./urlReflectors/ReflectorBase.js";

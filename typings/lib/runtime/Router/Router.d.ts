/**
 * @typedef {function({route: Route}): any} BeforeUrlChangeCallback
 * @typedef {function({route: Route}, Route[]): any} afterUrlChangeCallback
 * @typedef {function(RouteFragment[]):RouteFragment[]} BeforeRenderCallback
 * @typedef {function({router: typeof this}):void} OnDestroyRouterCallback
 */
/**
 * @typedef {import('../utils/index.js').Getable<Route>} RouteStore
 *
 *
 * @typedef {Object} RouterOptions
 * @prop {RoutifyRuntime} instance
 * @prop {RNodeRuntime} rootNode
 * @prop {any} routes
 * @prop {string} name
 * @prop {UrlRewrite|UrlRewrite[]} urlRewrite
 * @prop {typeof BaseReflector} urlReflector
 * @prop { string } url initial url
 * @prop { Boolean| typeof Router } passthrough ignore clicks
 * @prop { BeforeUrlChangeCallback } beforeUrlChange
 * @prop { afterUrlChangeCallback } afterUrlChange
 * @prop { BeforeRenderCallback } beforeRender
 * @prop { OnDestroyRouterCallback } beforeDestroy
 *
 * @typedef {Object} ParentCmpCtx
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 * @prop {Object.<String|Number, String|Number>} localParams
 * @prop {Object.<String|Number, any>} options
 */
/**
 * @template T
 * @typedef {import('svelte/store').Readable} Readable<T>
 */
/**
 * @implements {Readable<Router>}
 */
export class Router implements Readable<Router> {
    /**
     * @param {Partial<RouterOptions>} options
     */
    constructor(options: Partial<RouterOptions>);
    subscribe: any;
    /** @private is assigned in constructor  */
    private set;
    /** @type {RouteStore} */
    pendingRoute: RouteStore;
    /** @type {RouteStore} */
    activeRoute: RouteStore;
    /** @type {UrlRewrite[]} */
    urlRewrites: UrlRewrite[];
    /** @type {import('hookar').HooksCollection<BeforeUrlChangeCallback>} */
    beforeUrlChange: import('hookar').HooksCollection<BeforeUrlChangeCallback>;
    /** @type {import('hookar').HooksCollection<afterUrlChangeCallback>} */
    afterUrlChange: import('hookar').HooksCollection<afterUrlChangeCallback>;
    /** @type {import('hookar').HooksCollection<BeforeRenderCallback>} */
    beforeRender: import('hookar').HooksCollection<BeforeRenderCallback>;
    /** @type {import('hookar').HooksCollection<OnDestroyRouterCallback>} */
    onDestroy: import("hookar").HooksCollection<OnDestroyRouterCallback>;
    parentElem: any;
    queryHandler: {
        parse: (search: any) => any;
        stringify: (params: any) => string;
    };
    scrollHandler: {
        isScrolling: import("svelte/store").Writable<boolean>;
        run: ({ route }: {
            route: Route;
        }, history: any) => void;
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
    params: import("svelte/store").Readable<any>;
    /**
     * @param {Partial<RouterOptions>} param1
     */
    init({ instance, rootNode, name, routes, urlRewrite, urlReflector, url, passthrough, beforeUrlChange, afterUrlChange, beforeRender, }?: Partial<RouterOptions>): void;
    /** @type {RoutifyRuntime} */
    instance: RoutifyRuntime;
    name: any;
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
export type BeforeUrlChangeCallback = (arg0: {
    route: Route;
}) => any;
export type afterUrlChangeCallback = (arg0: {
    route: Route;
}, arg1: Route[]) => any;
export type BeforeRenderCallback = (arg0: RouteFragment[]) => RouteFragment[];
export type OnDestroyRouterCallback = (arg0: {
    router: typeof this;
}) => void;
export type RouteStore = import('../utils/index.js').Getable<Route>;
export type RouterOptions = {
    instance: RoutifyRuntime;
    rootNode: RNodeRuntime;
    routes: any;
    name: string;
    urlRewrite: UrlRewrite | UrlRewrite[];
    urlReflector: typeof BaseReflector;
    /**
     * initial url
     */
    url: string;
    /**
     * ignore clicks
     */
    passthrough: boolean | typeof Router;
    beforeUrlChange: BeforeUrlChangeCallback;
    afterUrlChange: afterUrlChangeCallback;
    beforeRender: BeforeRenderCallback;
    beforeDestroy: OnDestroyRouterCallback;
};
export type ParentCmpCtx = {
    route: Route;
    node: RNodeRuntime;
    localParams: any;
    options: any;
};
/**
 * <T>
 */
export type Readable<T> = import("svelte/store").Readable<any>;
import { Route } from "../Route/Route.js";
import { RoutifyRuntime } from "../Instance/RoutifyRuntime.js";
import { BaseReflector } from "./urlReflectors/ReflectorBase.js";

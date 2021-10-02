/**
 * @typedef {import('svelte/store').Writable<Route>} RouteStore
 *
 * @typedef {Object} RouterOptions
 * @prop {RoutifyRuntime} instance
 * @prop {RNodeRuntime} rootNode
 * @prop {any} routes
 * @prop {string} name
 *
 * @typedef {Object} ParentCmpCtx
 * @prop {Route} route
 * @prop {RNodeRuntime} node
 * @prop {Object.<String|Number, String|Number>} localParams
 * @prop {Object.<String|Number, any>} options
 */
export class Router {
    /**
     * @param {Partial<RouterOptions>} param1
     */
    constructor({ instance, rootNode, name, routes }?: Partial<RouterOptions>);
    /** @type {RouteStore} */
    pendingRoute: import("svelte/store").Writable<Route>;
    /** @type {RouteStore} */
    activeRoute: import("svelte/store").Writable<Route>;
    urlTransforms: any[];
    beforeUrlChange: {
        (hook: Function): Function;
        hooks: any[];
    };
    afterUrlChange: {
        (hook: Function): Function;
        hooks: any[];
    };
    onDestroy: {
        (hook: Function): Function;
        hooks: any[];
    };
    parentElem: any;
    queryHandler: {
        parse: (search: any) => any;
        stringify: (params: any) => string;
    };
    url: {
        set: (url: string, mode: UrlState) => Promise<true | false>;
        getActive: () => string;
        getPending: () => string;
        get: () => string;
        push: (url: any) => Promise<boolean>;
        replace: (url: any) => Promise<boolean>;
        pop: (url: any) => Promise<boolean>;
        toString: () => string;
    };
    ready: Promise<any>;
    /** @type {Route[]} */
    history: Route[];
    instance: RoutifyRuntime;
    name: string;
    parentCmpCtx: any;
    rootNode: import("../Instance/RNodeRuntime.js").RNodeRuntime;
    log: any;
    params: import("svelte/store").Readable<any>;
    scrollHandler: {
        isScrolling: import("svelte/store").Writable<boolean>;
        run: (activeRoute: import("svelte/store").Readable<Route>, history: any) => void;
    };
    /**
     *
     * @param {string} url
     * @param {UrlState} mode
     * @returns {Promise<true|false>}
     */
    _setUrl(url: string, mode: UrlState): Promise<true | false>;
    destroy(): void;
    /** @param {typeof BaseReflector} UrlReflector */
    set urlReflector(arg: import("svelte/store").Writable<BaseReflector>);
    /** @type {import('svelte/store').Writable<BaseReflector>} */
    get urlReflector(): import("svelte/store").Writable<BaseReflector>;
    #private;
}
export function createRouter(options: RouterOptions): Router;
export type RouteStore = import('svelte/store').Writable<Route>;
export type RouterOptions = {
    instance: RoutifyRuntime;
    rootNode: RNodeRuntime;
    routes: any;
    name: string;
};
export type ParentCmpCtx = {
    route: Route;
    node: RNodeRuntime;
    localParams: any;
    options: any;
};
import { Route } from "../Route/Route.js";
import { RoutifyRuntime } from "../Instance/RoutifyRuntime.js";
import { BaseReflector } from "./urlReflectors/ReflectorBase.js";

export * from "./preload.js";
export function getMRCA(node1: RNodeRuntime, node2: RNodeRuntime): {
    mrca: import("../Instance/RNodeRuntime.js").RNodeRuntime;
    index1: number;
    index2: number;
    lineage1: import("../Instance/RNodeRuntime.js").RNodeRuntime[];
    lineage2: import("../Instance/RNodeRuntime.js").RNodeRuntime[];
    descendants1: import("../Instance/RNodeRuntime.js").RNodeRuntime[];
    descendants2: import("../Instance/RNodeRuntime.js").RNodeRuntime[];
};
export function getPath(node1: any, node2: any): string;
/**
 * @callback Goto
 * @param {string|RNodeRuntime} pathOrNode relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {Partial<$UrlOptions & RouteState>=} options
 * @type {Readable<Goto>} */
export const goto: Readable<Goto>;
/**
 * @template T
 * @typedef {import('svelte/store').Readable<T>} Readable
 */
/**
 * @typedef {Object} IsActiveOptions
 * @prop {Boolean} [recursive=true] return true if descendant is active
 */
/**
 * @typedef {Object} $UrlOptions
 * @prop {boolean} strict Require internal paths. Eg. `/blog/[slug]` instead of `/blog/hello-world`
 * @prop {boolean} includeIndex suffix path with `/index`
 * @prop {boolean} silent suppress errors
 * @prop {'push'|'replace'} mode push to or replace in navigation history
 */
/**
 * @typedef {Partial<{
 *  dontscroll: boolean,
 *  dontsmoothscroll: boolean,
 * [key:string]: *
 * }>} RouteState
 */
/**
 * @typedef {(<T extends string | HTMLAnchorElement>(
 *   inputPath: T,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => T extends HTMLAnchorElement ? void : string)} Url
 */
/**
 * @typedef {((
 *   pathOrNode: string|RNodeRuntime,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => string)} UrlFromString
 */
/**
 * @type {Readable<Url>}
 */
export const _url: Readable<Url>;
/**
 * @type {Readable<Url>}
 */
export const url: Readable<Url>;
export function createUrl(fragment: RouteFragment, router: Router): UrlFromString;
/**
 * @type {Readable<Object.<string, any>>}
 */
export const params: Readable<{
    [x: string]: any;
}>;
/**
 * @callback IsActive
 * @param {String|RNodeRuntime=} pathOrNode
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 *
 * @type {Readable<IsActive>} */
export const isActive: Readable<IsActive>;
export namespace isActiveFragment {
    function subscribe(run: any, invalidate: any): import("svelte/store").Unsubscriber;
}
export function isActiveUrl(renderContext: RenderContext): (pathOrNode: string | import("../Instance/RNodeRuntime.js").RNodeRuntime, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export function resolveNode(path: string): import("../Instance/RNodeRuntime.js").RNodeRuntime;
export function traverseNode(node: RNodeRuntime, path: string, router: Router): RNodeRuntime;
export const context: import("svelte/store").Readable<import("../renderer/RenderContext.js").RenderContext>;
export const node: import("svelte/store").Readable<import("../Instance/RNodeRuntime.js").RNodeRuntime>;
export const meta: import("svelte/store").Readable<{
    [x: string]: any;
}>;
/** @type {Readable<Route>} */
export const activeRoute: Readable<Route>;
/** @type {Readable<Route>} */
export const pendingRoute: Readable<Route>;
/**@type {Readable<function(AfterUrlChangeCallback):any>} */
export const afterUrlChange: Readable<(arg0: AfterUrlChangeCallback) => any>;
/**@type {Readable<function(BeforeUrlChangeCallback):any>} */
export const beforeUrlChange: Readable<(arg0: BeforeUrlChangeCallback) => any>;
/**
 * @callback getDirectionCB
 * @param {RNodeRuntime=} boundary
 * @param {Route=} newRoute
 * @param {Route=} oldRoute
 * @returns {'first'|'last'|'same'|'next'|'prev'|'higher'|'lower'|'na'}
 */
/**
 * @type {getDirectionCB & Readable<ReturnType<getDirectionCB>>}
 */
export const getDirection: getDirectionCB & Readable<ReturnType<getDirectionCB>>;
export type Goto = (pathOrNode: string | RNodeRuntime, userParams?: {
    [x: string]: string;
} | undefined, options?: Partial<$UrlOptions & RouteState> | undefined) => any;
export type Readable<T> = import('svelte/store').Readable<T>;
export type IsActiveOptions = {
    /**
     * return true if descendant is active
     */
    recursive?: boolean;
};
export type $UrlOptions = {
    /**
     * Require internal paths. Eg. `/blog/[slug]` instead of `/blog/hello-world`
     */
    strict: boolean;
    /**
     * suffix path with `/index`
     */
    includeIndex: boolean;
    /**
     * suppress errors
     */
    silent: boolean;
    /**
     * push to or replace in navigation history
     */
    mode: 'push' | 'replace';
};
export type RouteState = {
    [x: string]: any;
    dontscroll?: boolean;
    dontsmoothscroll?: boolean;
};
export type Url = <T extends string | HTMLAnchorElement>(inputPath: T, userParams?: {
    [x: string]: string;
}, options?: Partial<$UrlOptions>) => T extends HTMLAnchorElement ? void : string;
export type UrlFromString = (pathOrNode: string | RNodeRuntime, userParams?: {
    [x: string]: string;
}, options?: Partial<$UrlOptions>) => string;
export type IsActive = (pathOrNode?: (string | RNodeRuntime) | undefined, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export type getDirectionCB = (boundary?: RNodeRuntime | undefined, newRoute?: Route | undefined, oldRoute?: Route | undefined) => 'first' | 'last' | 'same' | 'next' | 'prev' | 'higher' | 'lower' | 'na';

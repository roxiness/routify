export * from "./scroll.js";
export function getMRCA(node1: RNodeRuntime, node2: RNodeRuntime): import("../Instance/RNodeRuntime.js").RNodeRuntime;
export function getPath(node1: any, node2: any): string;
/**
 * @callback Goto
 * @param {string} path relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {Partial<$UrlOptions & {mode: 'push' | 'replace'}>=} options
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
 */
/**
 * @typedef {(<T extends string | HTMLAnchorElement>(
 *   inputPath: T,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => T extends HTMLAnchorElement ? void : string)} Url
 */
/**
 * @type {Readable<Url>}
 */
export const url: Readable<Url>;
export function createUrl(router: Router, originNode: RNodeRuntime, activeRoute: Route): Url;
/**
 * @type {Readable<Object.<string, any>>}
 */
export const params: Readable<{
    [x: string]: any;
}>;
/**
 * @callback IsActive
 * @param {String=} path
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 *
 * @type {Readable<IsActive>} */
export const isActive: Readable<IsActive>;
export function isActiveRoute($route: Route): (path: string, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export function isActiveUrl(url: any, actualParams?: {}): (path: string, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export function resolveNode(path: string): import("../Instance/RNodeRuntime.js").RNodeRuntime;
export function traverseNode(node: RNodeRuntime, path: string, router: Router): RNodeRuntime;
export const context: import("svelte/store").Readable<RenderContext>;
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
export type Goto = (path: string, userParams?: {
    [x: string]: string;
} | undefined, options?: Partial<$UrlOptions & {
    mode: 'push' | 'replace';
}> | undefined) => any;
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
};
export type Url = <T extends string | HTMLAnchorElement>(inputPath: T, userParams?: {
    [x: string]: string;
}, options?: Partial<$UrlOptions>) => T extends HTMLAnchorElement ? void : string;
export type IsActive = (path?: string | undefined, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;

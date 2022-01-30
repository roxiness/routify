export function getMRCA(node1: import("../../common/RNode.js").RNode<any>, node2: import("../../common/RNode.js").RNode<any>): import("../../common/RNode.js").RNode<any>;
export function getPath(node1: any, node2: any): string;
/**
 * @callback Goto
 * @param {string} path relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {any=} options
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
 * @callback Url
 * @param {string} inputPath
 * @param {Object.<string, string>=} userParams
 * @returns {string}
 *
 * @type {Readable<Url>}
 **/
export const url: Readable<Url>;
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
export function isActiveRoute($route: any): (path: string, params: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export function isActiveUrl(url: any): (path: string, params: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;
export function resolveNode(path: string): void | import("../Instance/RNodeRuntime.js").RNodeRuntime;
export function resolveAbsoluteNode(node: any, path: any): void;
export function traverseNode(node: RNodeRuntime, path: string): RNodeRuntime;
export function resolveNamedNode(node: any, name: any): void;
export const context: import("svelte/store").Readable<FragmentContext>;
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
} | undefined, options?: any | undefined) => any;
export type Readable<T> = import('svelte/store').Readable<T>;
export type IsActiveOptions = {
    /**
     * return true if descendant is active
     */
    recursive?: boolean;
};
export type Url = (inputPath: string, userParams?: {
    [x: string]: string;
} | undefined) => string;
export type IsActive = (path?: string | undefined, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;

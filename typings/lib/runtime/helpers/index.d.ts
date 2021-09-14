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
 * @param {Object.<string, string>} userParams
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
export function resolveRelativeNode(node: RNodeRuntime, path: string): RNodeRuntime;
export function resolveNamedNode(node: any, name: any): void;
/**
 * @type {Readable<FragmentContext>}
 */
export const context: Readable<FragmentContext>;
export const node: import("svelte/store").Readable<import("../Instance/RNodeRuntime.js").RNodeRuntime>;
export const meta: import("svelte/store").Readable<any>;
export type Readable<T> = import('svelte/store').Readable<T>;
export type IsActiveOptions = {
    /**
     * return true if descendant is active
     */
    recursive?: boolean;
};
export type Url = (inputPath: string, userParams: {
    [x: string]: string;
}) => string;
export type IsActive = (path?: string | undefined, params?: {
    [x: string]: string;
}, options?: IsActiveOptions) => boolean;

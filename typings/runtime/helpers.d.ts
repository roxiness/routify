/** *
 * @param {ClientNodeApi} descendant
 * @param {ClientNodeApi} ancestor
 * @param {boolean} treatIndexAsAncestor
 */
export function isAncestor(ancestor: ClientNodeApi, descendant: ClientNodeApi, treatIndexAsAncestor?: boolean): any;
/**
 * @param {{component: ClientNode}} $ctx
 * @param {RouteNode} $currentRoute
 * @param {RouteNode[]} $routes
 * @returns {UrlHelper}
 */
export function makeUrlHelper($ctx: {
    component: ClientNode;
}, $currentRoute: RouteNode, $routes: RouteNode[]): UrlHelper;
/**
 * @param {string|ClientNodeApi} path
 * @param {*} options
 */
export function precache(path: string | ClientNodeApi, options: any): void;
/**
 * @param {string|ClientNodeApi} path
 * @param {*} options
 */
export function prefetch(path: string | ClientNodeApi, options: any): void;
/**
 * @typedef {[ClientNodeApi, ClientNodeApi, ClientNodeApi]} ConcestorReturn
 * @typedef {function(ClientNodeApi, ClientNodeApi):ConcestorReturn} GetConcestor
 * @type {GetConcestor}
 */
export function getConcestor(nodeApi1: ClientNodeApi, nodeApi2: ClientNodeApi): [ClientNodeApi, ClientNodeApi, ClientNodeApi];
/**
 * Get index difference between two paths
 *
 * @export
 * @param {array} paths
 * @param {object} newPath
 * @param {object} oldPath
 * @returns {number}
 */
export function getDirection(paths: any[], newPath: object, oldPath: object): number;
/**
 * Sets element to active
 * @typedef {function(HTMLElement):void} FocusHelper
 * @type {FocusHelper}
 */
export function focus(element: HTMLElement): void;
export namespace nodes {
    export function subscribe(run: any): import("svelte/store").Unsubscriber;
    export function subscribe(run: any): import("svelte/store").Unsubscriber;
}
export namespace components { }
/**
 * @typedef {import('svelte/store').Readable<ClientNodeApi>} ClientNodeHelperStore
 * @type { ClientNodeHelperStore }
 */
export const page: import("svelte/store").Readable<ClientNodeApi>;
/** @type {ClientNodeHelperStore} */
export const node: import("svelte/store").Readable<ClientNodeApi>;
/** @type {ClientNodeHelperStore} */
export const layout: import("svelte/store").Readable<ClientNodeApi>;
/**
* @typedef {{component: ClientNode}}  ContextHelper
* @typedef {import('svelte/store').Readable<ContextHelper>} ContextHelperStore
* @type {ContextHelperStore}
*/
export const context: import("svelte/store").Readable<{
    component: ClientNode;
}>;
/**
 * @typedef {function():void} ReadyHelper
 * @typedef {import('svelte/store').Readable<ReadyHelper>} ReadyHelperStore
 * @type {ReadyHelperStore}
*/
export const ready: import("svelte/store").Readable<() => void>;
/**
 * @callback AfterPageLoadHelper
 * @param {function} callback
 *
 * @typedef {import('svelte/store').Readable<AfterPageLoadHelper> & {_hooks:Array<function>}} AfterPageLoadHelperStore
 * @type {AfterPageLoadHelperStore}
 */
export const afterPageLoad: AfterPageLoadHelperStore;
/**
 * @callback BeforeUrlChangeHelper
 * @param {function} callback
 *
 * @typedef {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} BeforeUrlChangeHelperStore
 * @type {BeforeUrlChangeHelperStore}
 **/
export const beforeUrlChange: BeforeUrlChangeHelperStore;
/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed. *
 * @typedef {Object.<string, *>} ParamsHelper
 * @typedef {import('svelte/store').Readable<ParamsHelper>} ParamsHelperStore
 * @type {ParamsHelperStore}
 **/
export const params: import("svelte/store").Readable<{
    [x: string]: any;
}>;
/**
 * @typedef {string} LeftoverHelper
 * @typedef {import('svelte/store').Readable<string>} LeftoverHelperStore
 * @type {LeftoverHelperStore}
 **/
export const leftover: import("svelte/store").Readable<string>;
/**
 * @typedef {import('svelte/store').Readable<Meta>} MetaHelperStore
 * @type {MetaHelperStore}
 * */
export const meta: import("svelte/store").Readable<{
    [x: string]: any;
}>;
/**
 * @typedef {{
 *   (el: Node): {update: (args: any) => void;}
 *   (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined): string;
 * }} UrlHelper
 * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
 * @type {UrlHelperStore}
 * */
export const url: import("svelte/store").Readable<{
    (el: Node): {
        update: (args: any) => void;
    };
    (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined): string;
}>;
/**
* @callback GotoHelper
* @param {String=} path
* @param {UrlParams=} params
* @param {GotoOptions=} options
*
* @typedef {import('svelte/store').Readable<GotoHelper>}  GotoHelperStore
* @type {GotoHelperStore}
* */
export const goto: import("svelte/store").Readable<GotoHelper>;
/**
 * @type {GotoHelperStore}
 * */
export const redirect: import("svelte/store").Readable<GotoHelper>;
/**
 * @callback IsActiveHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @returns {Boolean}
 *
 * @typedef {import('svelte/store').Readable<IsActiveHelper>} IsActiveHelperStore
 * @type {IsActiveHelperStore}
 * */
export const isActive: import("svelte/store").Readable<IsActiveHelper>;
/**
 * metatags
 * @prop {Object.<string, string>}
 */
export const metatags: any;
export type RoutifyContext = {
    component: ClientNode;
    layout: ClientNode;
    componentFile: any;
};
export type ConcestorReturn = [ClientNodeApi, ClientNodeApi, ClientNodeApi];
export type GetConcestor = (arg0: ClientNodeApi, arg1: ClientNodeApi) => [ClientNodeApi, ClientNodeApi, ClientNodeApi];
/**
 * Sets element to active
 */
export type FocusHelper = (arg0: HTMLElement) => void;
export type ClientNodeHelperStore = import("svelte/store").Readable<ClientNodeApi>;
export type ContextHelper = {
    component: ClientNode;
};
export type ContextHelperStore = import("svelte/store").Readable<{
    component: ClientNode;
}>;
export type ReadyHelper = () => void;
export type ReadyHelperStore = import("svelte/store").Readable<() => void>;
export type AfterPageLoadHelper = (callback: Function) => any;
export type AfterPageLoadHelperStore = import("svelte/store").Readable<AfterPageLoadHelper> & {
    _hooks: Array<Function>;
};
export type BeforeUrlChangeHelper = (callback: Function) => any;
export type BeforeUrlChangeHelperStore = import("svelte/store").Readable<BeforeUrlChangeHelper> & {
    _hooks: Array<Function>;
};
/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed. *
 */
export type ParamsHelper = {
    [x: string]: any;
};
/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed. *
 */
export type ParamsHelperStore = import("svelte/store").Readable<{
    [x: string]: any;
}>;
export type LeftoverHelper = string;
export type LeftoverHelperStore = import("svelte/store").Readable<string>;
export type MetaHelperStore = import("svelte/store").Readable<{
    [x: string]: any;
}>;
export type UrlHelper = {
    (el: Node): {
        update: (args: any) => void;
    };
    (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined): string;
};
export type UrlHelperStore = import("svelte/store").Readable<{
    (el: Node): {
        update: (args: any) => void;
    };
    (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined): string;
}>;
export type GotoHelper = (path?: string | undefined, params?: UrlParams | undefined, options?: GotoOptions | undefined) => any;
export type GotoHelperStore = import("svelte/store").Readable<GotoHelper>;
export type IsActiveHelper = (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined) => boolean;
export type IsActiveHelperStore = import("svelte/store").Readable<IsActiveHelper>;

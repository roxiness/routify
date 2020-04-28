/**
 * @param {{component: ClientNode}} $ctx
 * @param {RouteNode} $oldRoute
 * @param {RouteNode[]} $routes
 * @param {{base: string, path: string}} $location
 * @returns {UrlHelper}
 */
export function makeUrlHelper($ctx: {
    component: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
}, $oldRoute: {
    [x: string]: any;
} & MiscFile & GeneratedFile & DefinedFile, $routes: ({
    [x: string]: any;
} & MiscFile & GeneratedFile & DefinedFile)[], $location: {
    base: string;
    path: string;
}): UrlHelper;
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
 * @returns In
 */
export function getDirection(paths: any[], newPath: any, oldPath: any): number;
/**
 * Sets element to active
 * @typedef {function(HTMLElement):void} FocusHelper
 * @type {FocusHelper}
 */
export function focus(element: HTMLElement): void;
/**
 * @typedef {import('svelte/store').Readable<ClientNodeApi>} ClientNodeHelperStore
 * @type { ClientNodeHelperStore }
 */
export const page: ClientNodeHelperStore;
/** @type {ClientNodeHelperStore} */
export const layout: ClientNodeHelperStore;
/**
* @typedef {{component: ClientNode}}  ContextHelper
* @typedef {import('svelte/store').Readable<ContextHelper>} ContextHelperStore
* @type {ContextHelperStore}
*/
export const context: ContextHelperStore;
/**
 * @typedef {function():void} ReadyHelper
 * @typedef {import('svelte/store').Readable<ReadyHelper>} ReadyHelperStore
 * @type {ReadyHelperStore}
*/
export const ready: ReadyHelperStore;
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
export const params: ParamsHelperStore;
/**
 * @typedef {string} LeftoverHelper
 * @typedef {import('svelte/store').Readable<string>} LeftoverHelperStore
 * @type {LeftoverHelperStore}
 **/
export const leftover: LeftoverHelperStore;
/**
 * @typedef {import('svelte/store').Readable<Meta>} MetaHelperStore
 * @type {MetaHelperStore}
 * */
export const meta: MetaHelperStore;
/**
 * @callback UrlHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @return {String}
 *
 * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
 * @type {UrlHelperStore}
 * */
export const url: UrlHelperStore;
/**
* @callback GotoHelper
* @param {String=} path
* @param {UrlParams=} params
* @param {GotoOptions=} options
*
* @typedef {import('svelte/store').Readable<GotoHelper>}  GotoHelperStore
* @type {GotoHelperStore}
* */
export const goto: GotoHelperStore;
/**
 * @type {GotoHelperStore}
 * */
export const redirect: GotoHelperStore;
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
export const isActive: IsActiveHelperStore;
/**
 * metatags
 * @prop {Object.<string, string>}
 */
export const metatags: any;
export type RoutifyContext = {
    component: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
    layout: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
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
    component: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
};
export type ContextHelperStore = import("svelte/store").Readable<{
    component: {
        [x: string]: any;
    } & DefinedFile & ClientNodeSpecifics;
}>;
export type ReadyHelper = () => void;
export type ReadyHelperStore = import("svelte/store").Readable<() => void>;
export type AfterPageLoadHelper = (callback: Function) => any;
export type AfterPageLoadHelperStore = import("svelte/store").Readable<AfterPageLoadHelper> & {
    _hooks: Function[];
};
export type BeforeUrlChangeHelper = (callback: Function) => any;
export type BeforeUrlChangeHelperStore = import("svelte/store").Readable<BeforeUrlChangeHelper> & {
    _hooks: Function[];
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
export type MetaHelperStore = import("svelte/store").Readable<Meta>;
export type UrlHelper = (path?: string, params?: {
    [x: string]: any;
}, options?: UrlOptions) => string;
export type UrlHelperStore = import("svelte/store").Readable<UrlHelper>;
export type GotoHelper = (path?: string, params?: {
    [x: string]: any;
}, options?: GotoOptions) => any;
export type GotoHelperStore = import("svelte/store").Readable<GotoHelper>;
export type IsActiveHelper = (path?: string, params?: {
    [x: string]: any;
}, options?: UrlOptions) => boolean;
export type IsActiveHelperStore = import("svelte/store").Readable<IsActiveHelper>;

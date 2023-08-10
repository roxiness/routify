export function spreadsLast(node: any): 1 | -1;
export function getNearestAncestorNodeWithSpreadParam(routeFragments: RouteFragment[]): RNodeRuntime;
export function getUrlFragments(url: any): any;
export function indexOfNode(fragments: any, node: any): any;
export function URIDecodeObject<T extends {
    [x: string]: string | string[];
}>(obj: T): T;
/**
 * @template P
 * @typedef {Object} LoadCacheFetchOptions
 * @prop {(() => Promise<P>) |( ()=> P)} hydrate
 * @prop {(res:P) => Boolean|Number} [clear]
 **/
/**
 * @template P
 * LoadCache is a simple class implementation for caching Route.load
 */
export class LoadCache<P> {
    /** @type {Map<string, Promise<P>|P >} */
    map: Map<string, Promise<P> | P>;
    /**
     * Fetches data for the given ID and caches it.
     * @param {any} id
     * @param {LoadCacheFetchOptions<P>} options
     * @returns {Promise<P>}
     */
    fetch(id: any, options: LoadCacheFetchOptions<P>): Promise<P>;
    /**
     * Handles the Promise resolution, cache expiration, and cache clearing.
     * @param {any} id
     * @param {LoadCacheFetchOptions<P>} options
     */
    _handlePromise(id: any, options: LoadCacheFetchOptions<P>): Promise<void>;
}
export type LoadCacheFetchOptions<P> = {
    hydrate: (() => Promise<P>) | (() => P);
    /**
     * **
     */
    clear?: (res: P) => boolean | number;
};

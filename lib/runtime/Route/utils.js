export const spreadsLast = node => (node.name.match(/\[\.\.\.(.+)\]/) ? 1 : -1)

/**
 *
 * @param {RouteFragment[]} routeFragments
 * @returns {RNodeRuntime}
 */
export const getNearestAncestorNodeWithSpreadParam = routeFragments => {
    for (const fragment of [...routeFragments].reverse()) {
        for (const node of fragment.node.parent?.children || []) {
            const match = node.name.match(/\[\.\.\.(.+)\]/)
            if (match) return node
        }
    }
}

export const getUrlFragments = url =>
    url
        .replace(/[?#].+/, '') // strip the search and hash query
        .replace(/\/$/, '') // strip trailing slash
        .split('/')
        .slice(1) // skip the first fragment since it will always be empty

export const indexOfNode = (fragments, node) =>
    fragments.findIndex(fragment => fragment.node === node)

/**
 * @template {string|string[]} T
 * @param {T} strOrArr
 * @returns {T}
 */
const uriDecodeStringOrArray = strOrArr =>
    strOrArr instanceof Array
        ? /** @type {T} */ (strOrArr.map(decodeURI))
        : /** @type {T} */ (decodeURI(strOrArr))

export const URIDecodeObject = obj =>
    Object.entries(obj).reduce(
        (_return, [key, value]) => ({
            ..._return,
            [key]: uriDecodeStringOrArray(value),
        }),
        {},
    )

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
export class LoadCache {
    constructor() {
        /** @type {Map<string, Promise<P>|P >} */
        this.map = new Map()
    }

    /**
     * Fetches data for the given ID and caches it.
     * @param {any} id
     * @param {LoadCacheFetchOptions<P>} options
     * @returns {Promise<P>}
     */
    async fetch(id, options) {
        if (!this.map.has(id)) this.map.set(id, options.hydrate())

        this._handlePromise(id, options)

        return this.map.get(id)
    }
    /**
     * Handles the Promise resolution, cache expiration, and cache clearing.
     * @param {any} id
     * @param {LoadCacheFetchOptions<P>} options
     */
    async _handlePromise(id, options) {
        const value = await this.map.get(id)
        const clear = options.clear?.(value)
        if (typeof clear === 'number') setTimeout(() => this.map.delete(id), clear)
        else if (clear) this.map.delete(id)
    }
}

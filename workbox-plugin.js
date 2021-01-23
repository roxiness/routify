// @ts-check

const freshCache = {
    map: new Map(),
    set(req, value) { return this.map.set(reqToStr(req), value) },
    get(req) {
        const cache = this.map.get(reqToStr(req))
        // @ts-ignore
        if (cache) cache.validLeft = (new Date(cache.validUntil) - new Date())/1000
        return cache
    }
}

export const RoutifyPlugin = function (defaultOptions) {
    return {
        cachedResponseWillBeUsed({ cacheName, request, matchOptions, cachedResponse, event }) {
            if (getHeaderOptions(request).writeHeaders !== true)
                return cachedResponse;

            const headers = new Headers(cachedResponse.headers)
            const fetch = freshCache.get(request) || {}
            for (const [key, val] of Object.entries(fetch))
                headers.set('x-routify-' + kebabify(key), val)
            headers.set('x-routify-use-cache', "true")
            return cachedResponse.arrayBuffer().then(buffer => new Response(buffer, { ...cachedResponse, headers }))
        },
        cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse, event }) => {
            // if cached updated we update freshCache
            const prefetchOptions = getPrefetchOptions(event.request)
            const headerOptions = getHeaderOptions(event.request)
            const options = { ...defaultOptions, ...prefetchOptions, ...headerOptions }
            const date = Date.now()

            freshCache.set(event.request, {
                ...options,
                validUntil: new Date(date + (options.validFor * 1000)).toISOString(),
                cachedAt: (new Date(date)).toISOString()
            })
        }
    }
}


export function freshCacheData(event) {
    cleanupFreshCache()
    return freshCache.get(event.request)
}



/**
 * 
 */
function cleanupFreshCache() {
    freshCache.map.forEach((data, key) => {
        if (new Date(data.validUntil) < new Date) {
            freshCache.map.delete(key)
        }
    })
}


/**
 * Get options caching options from routify
 * @param {Request} request 
 */
function getPrefetchOptions({ referrer }) {
    referrer = referrer.replace(/\w+:\/\/[^/]+/, '')
    const [path, _options] = referrer.split('__[[routify_url_options]]__')
    const options = JSON.parse(decodeURIComponent(_options || '') || '{}')
    return options
}


function getHeaderOptions({ headers }) {
    const routifyHeaders = [...headers.entries()].filter(([key]) => key.startsWith('x-routify-'))

    const options = {}
    for (const [key, val] of routifyHeaders) {
        const name = camelize(key.replace('x-routify-', ''))
        options[name] = parse(val)
    }
    return options
}


function reqToStr({ url, headers, method }) { return JSON.stringify({ url, method, headers: [...headers.entries()], }) }
function kebabify(str) { return str.replace(/[A-Z]/g, x => '-' + x.toLowerCase()) }
function camelize(str) { return str.replace(/-./g, x => x.toUpperCase()[1]) }
function parse(str) { try { return JSON.parse(str) } catch (err) { } }
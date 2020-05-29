// @ts-check

const freshCache = {
    map: new Map(),
    set(req, value) { return this.map.set(reqToStr(req), value) },
    get(req) { return this.map.get(reqToStr(req)) }
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
            return cachedResponse.arrayBuffer().then(buffer => new Response(buffer, { ...cachedResponse, headers }))
        },
        cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse, event }) => {
            // if cached updated we update freshCache
            const prefetchOptions = getPrefetchOptions(event.request)
            const headerOptions = getHeaderOptions(event.request)

            const options = { ...defaultOptions, ...prefetchOptions, ...headerOptions }

            freshCache.set(event.request, {
                ...options,
                validUntil: Date.now() + (options.validFor * 1000)
            })
        }
    }
}


export function hasFreshCache(event) {
    cleanupFreshCache()
    return !!freshCache.get(event.request)
}



/**
 * 
 */
function cleanupFreshCache() {
    freshCache.map.forEach((data, key) => {
        if (data.validUntil < Date.now()) {
            freshCache.map.delete(key)
        }
    })
}


/**
 * Get options caching options from routify
 * @param {Request} request 
 */
function getPrefetchOptions({ referrer }) {
    const search = (referrer.match(/\?(.+)/) || [null, ''])[1]
    const routifyQueries = [...new URLSearchParams(search)].filter(([key]) => key.startsWith('__routify_'))

    const options = {}
    for (const [key, val] of routifyQueries)
        options[key.replace(/^__routify_/, '')] = val

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
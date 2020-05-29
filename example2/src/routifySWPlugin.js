// @ts-check

export const recentFetches = new Map()

export const RoutifyPlugin = {
    cachedResponseWillBeUsed({ cacheName, request, matchOptions, cachedResponse, event }) {
        if (getHeaderOptions(request).writeHeaders !== true)
            return cachedResponse;

        const headers = new Headers(cachedResponse.headers)
        const fetch = recentFetches.get(request.url) || {}
        for (const [key, val] of Object.entries(fetch))
            headers.set('x-routify-' + kebabify(key), val)
        return cachedResponse.arrayBuffer().then(buffer => new Response(buffer, { ...cachedResponse, headers }))
    }
}

/**
 * Create a wasRecentlyFetched function
 * @param {object} defaultOptions 
 */
export function wasRecentlyFetchedFactory(defaultOptions) {
    return function wasRecentlyFetched(event) {

        cleanupRecentFetches()
        const { method, url, headers } = event.request
        if (method != 'GET') return false

        const prefetchOptions = getPrefetchOptions(event.request)
        const headerOptions = getHeaderOptions(event.request)

        const options = { ...defaultOptions, ...prefetchOptions, ...headerOptions }


        const recentRequest = recentFetches.get(url)

        if (!recentRequest)
            recentFetches.set(url, {
                ...options,
                validUntil: Date.now() + (options.validFor * 1000)
            })
        return !!recentRequest
    }
}


/**
 * 
 */
function cleanupRecentFetches() {
    recentFetches.forEach((data, key) => {
        if (data.validUntil < Date.now()) {
            recentFetches.delete(key)
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

function parse(str) {
    try { str = JSON.parse(str) } catch (err) { }
    return str
}

function kebabify(str) { return str.replace(/[A-Z]/g, x => '-' + x.toLowerCase()) }
function camelize(str) { return str.replace(/-./g, x => x.toUpperCase()[1]) }
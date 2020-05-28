import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';



/**********
 * CONFIG *
 **********/

const entrypointUrl = '__app.html' // entrypoint
const fallbackImage = '404.svg'
const files = self.__WB_MANIFEST // files matching globDirectory and globPattern in rollup.config.js
const wasRecentlyFetchedDefaults = { validFor: 10 }

const externalAssetsConfig = () => ({
  cacheName: 'external',
  plugins: [
    markHeader(),
    new ExpirationPlugin({
      maxEntries: 50,
      purgeOnQuotaError: true
    })]
})



/**************
 * INITIALIZE *
 **************/

precacheAndRoute(files) // precache files

skipWaiting() // auto update service workers across all tabs when new release is available
clientsClaim() // take control of client without having to wait for refresh

/** 
 * manually upgrade service worker by sending a SKIP_WAITING message.
 * (remember to disable auto update above)
 */
// addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') skipWaiting(); });

/** initialize wasRecentlyFetched function */
const wasRecentlyFetched = wasRecentlyFetchedFactory(wasRecentlyFetchedDefaults)



/**********
 * ROUTES *
 **********/

// serve local pages from the SPA entry point (__app.html)
registerRoute(isLocalPage, matchPrecache(entrypointUrl))

// serve local assets from cache first
registerRoute(isLocalAsset, new CacheFirst())

// serve external assets from cache if they're fresh
registerRoute(wasRecentlyFetched, async function (params) {
  const strategy = new CacheFirst(externalAssetsConfig())
  const response = await strategy.handle(params)
  response.headers.set('foo', 'bar')
  response.headers.set('x-custom-header', 'bar')
  console.log('response', response)
  return response
})

// serve external pages and assets
setDefaultHandler(new NetworkFirst(externalAssetsConfig()));

// serve a fallback for 404s if possible or respond with an error
setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return await matchPrecache(entrypointUrl)
    case 'image':
      return await matchPrecache(fallbackImage)
    default:
      return Response.error();
  }
})



/**********
 * UTILS *
 **********/

function isLocalAsset({ url, request }) { return url.host === self.location.host && request.destination != 'document' }
function isLocalPage({ url, request }) { return url.host === self.location.host && request.destination === 'document' }

function markHeader() {
  return {
    cachedResponseWillBeUsed: ({ cacheName, request, matchOptions, cachedResponse, event }) => {
      if (cachedResponse.type === 'opaque')
        return cachedResponse;

      const headers = new Headers(cachedResponse.headers)
      headers.set('cached-response-will-be-used', 'yay')

      return cachedResponse.arrayBuffer().then(buffer => new Response(buffer, { ...cachedResponse, headers }))
    }
  }
}

/**
 * Create a wasRecentlyFetched function
 * @param {object} defaultOptions 
 */
function wasRecentlyFetchedFactory(defaultOptions) {
  const recentFetches = new Map()

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
        prefetchValidUntil: Date.now() + (options.validFor * 1000)
      })
    return !!recentRequest
  }

  /**
   * 
   */
  function cleanupRecentFetches() {
    recentFetches.forEach((data, key) => {
      if (data.prefetchValidUntil < Date.now()) {
        recentFetches.delete(key)
      }
    })
  }

  /**
   * Get options caching options from routify
   * @param {Request} request 
   */
  function getPrefetchOptions(request) {
    const { referrer } = request
    const headers = [...request.headers.entries()]
    const search = (referrer.match(/\?(.+)/) || [null, ''])[1]
    const optionsFromPrefetch = {}
    const optionsFromRequest = {}
    for (const [key, val] of [...new URLSearchParams(search)])
      optionsFromPrefetch[key.replace(/^__routify_/, '')] = val

    return optionsFromPrefetch
  }

  function getHeaderOptions({ headers }) {
    const routifyHeaders = [...headers.entries()].filter(([key]) => key.startsWith('x-routify-'))

    const options = {}
    for (const [key, val] of routifyHeaders) {
      const name = key.replace('x-routify-', '').replace(/-./g, x => x.toUpperCase()[1])
      options[name] = val
    }
    console.log({ options })
    return options
  }
}


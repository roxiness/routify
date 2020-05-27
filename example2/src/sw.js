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
const wasRecentlyFetchedDefaults = { prefetchValidFor: 10 }

const externalAssetsConfig = () => ({
  cacheName: 'external',
  plugins: [new ExpirationPlugin({
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
registerRoute(wasRecentlyFetched, new CacheFirst(externalAssetsConfig()))

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

    
    console.log('x-prefetchValidFor', headers.get('x-prefetchValidFor'))

    const prefetchOptions = getRoutifyOptions(event.request)
    const options = { ...defaultOptions }
    // const options = { ...defaultOptions, ...prefetchOptions }

    // console.log(options)

    const recentRequest = recentFetches.get(url)

    if (!recentRequest)
      recentFetches.set(url, {
        prefetchValidUntil: Date.now() + (options.prefetchValidFor * 1000)
      })
    console.log('had recent request', recentRequest, url)
    return !!recentRequest
  }

  /**
   * 
   */
  function cleanupRecentFetches() {
    recentFetches.forEach((data, key) => {
      console.log(data, key)
      if (data.prefetchValidUntil < Date.now()) {
        recentFetches.delete(key)
      }
    })
  }

  /**
   * Get options caching options from routify
   * @param {Request} request 
   */
  function getRoutifyOptions(request) {
    const { referrer } = request
    const search = (referrer.match(/\?(.+)/) || [null, ''])[1]
    const optionsFromPrefetch = {}
    const optionsFromRequest = {}
    for (const [key, val] of [...new URLSearchParams(search)])
      optionsFromPrefetch[key.replace(/^__routify_/, '')] = val

    console.log(request)
    // console.log(request.headers)

    return optionsFromPrefetch
  }
}
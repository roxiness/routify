// @ts-check

import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';
import { RoutifyPlugin, hasFreshCache } from './routifySWPlugin'



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
    RoutifyPlugin(wasRecentlyFetchedDefaults),
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



/**********
 * ROUTES *
 **********/

// serve local pages from the SPA entry point (__app.html)
registerRoute(isLocalPage, matchPrecache(entrypointUrl))

// serve local assets from cache first
registerRoute(isLocalAsset, new CacheFirst())

// serve external assets from cache if they're fresh
registerRoute(hasFreshCache, new CacheFirst(externalAssetsConfig()))

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
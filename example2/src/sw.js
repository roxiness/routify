import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkOnly } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';

const fallbackUrl = '__app.html'
const fallbackImage = 'fallback.svg'
const files = self.__WB_MANIFEST

precacheAndRoute(files)

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open("fallback")
      .then((cache) => cache.addAll([fallbackUrl, fallbackImage]))
  );

  //uncomment to automatically update service workers
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // claim clients without having to refresh browser
  clients.claim();
});

/**********
 * ROUTES *
 **********/

// bypass for cypress testing
registerRoute(({ url }) =>
  url.pathname.match(/^\/__(\/|cypress)/),
  new NetworkOnly()
)

// serve local pages from the SPA entry point (__app.html)
registerRoute(({ url, request }) =>
  url.host === self.location.host && request.destination === 'document',
  caches.match(fallbackUrl)
)

// serve local assets from cache first
registerRoute(({ url }) =>
  url.host === self.location.host,
  new CacheFirst()
)


// serve external pages and assets, if cache is fresh
setDefaultHandler(new CacheFirst({
  cacheName: 'external-cache',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 15
    })
  ]
}));

// serve a fallback for 404s if possible or respond with an error
setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(fallbackUrl);
    case 'image':
      return caches.match(fallbackImage);
    default:
      return Response.error();
  }
})

addEventListener('message', (event) => {
  console.log(event)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    skipWaiting();
  }
});
const CACHE_NAME = 'local-audio-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // We will dynamically cache other assets as they are requested.
  // For a Vite app, the main JS and CSS bundles will have hashed names,
  // so pre-caching them here statically is not ideal.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache during install');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, go to the network
      return fetch(event.request).then(networkResponse => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and can only be consumed once. Since we are consuming this
        // once by the browser and once by the cache, we need to clone it.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If both cache and network fail, you might want to return a fallback page
        // For example, if it's a navigation request, return an offline page
        if (event.request.mode === 'navigate') {
          // You would need an offline.html page for this
          // return caches.match('/offline.html');
        }
        // Otherwise, re-throw the error or return a generic error response
        return new Response('Network request failed and no cache available.', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // This ensures the service worker takes control immediately
  );
});
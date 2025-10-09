const CACHE_NAME = 'ferris-search-v1';
const OFFLINE_FALLBACK = '/';
const PRECACHE_URLS = ['/', '/search', '/favicon.ico'];

const isAdRequest = (url) => /adsense|doubleclick|googlesyndication/i.test(url);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((error) => console.error('Service Worker 预缓存失败', error))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

const shouldCacheResponse = (request, response) => {
  if (!response || response.status !== 200 || response.type !== 'basic') {
    return false;
  }

  const url = new URL(request.url);
  if (url.pathname === '/service-worker.js') {
    return false;
  }

  return true;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (isAdRequest(request.url)) {
    event.respondWith(new Response(null, { status: 204 }));
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const handleFetch = caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(request)
      .then((networkResponse) => {
        if (shouldCacheResponse(request, networkResponse)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_FALLBACK);
        }
        return caches.match(request);
      });
  });

  event.respondWith(handleFetch);
});

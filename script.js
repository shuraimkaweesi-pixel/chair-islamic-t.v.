// sw.js - Chair Islamic TV Service Worker
const CACHE_NAME = 'chair-islamic-tv-v2'; // <- increment this on every new deploy
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/quran.json',
  '/manifest.json',
  '/style.css',
  '/images/background.jpg',
  // add other static assets like logos, fonts, etc.
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // activate worker immediately
});

// Activate event - delete old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => 
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim(); // take control of all clients
});

// Fetch event - serve cached assets first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Optional: cache new requests dynamically
        return caches.open(CACHE_NAME).then((cache) => {
          // Only cache GET requests
          if(event.request.method === 'GET' && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => {
      // Optional fallback page if offline and asset missing
      return caches.match('/index.html');
    })
  );
});

// Optional: listen for messages from the page to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

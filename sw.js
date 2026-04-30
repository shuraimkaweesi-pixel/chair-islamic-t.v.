const CACHE_NAME = 'chair-islamic-v4';
const URLS_TO_CACHE = [
  '/chair-islamic/',
  '/chair-islamic/index.html',
  '/chair-islamic/hadith.html',
  '/chair-islamic/quran.html',
  '/chair-islamic/prayer.html',
  '/chair-islamic/videos.html',
  '/chair-islamic/styles.css',
  '/chair-islamic/hadiths.json',
  '/chair-islamic/manifest.json',
  '/chair-islamic/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/chair-islamic/index.html'))
  );
});

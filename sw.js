const CACHE_NAME = "chair-tv-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/quran.html",
  "/hadith.html",
  "/prayer.html",
  "/videos.html",
  "/styles.css",
  "/logo.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch (offline support)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

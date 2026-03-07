const CACHE_NAME = "chair-tv-cache-v1";
const urlsToCache = [
  "/chair-islamic-t.v./index.html",
  "/chair-islamic-t.v./images/background.jpg",
  "/chair-islamic-t.v./logo.png",
  "/chair-islamic-t.v./offline-message.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback offline message for radio
        if(event.request.url.includes(".mp3")) {
          return caches.match("/chair-islamic-t.v./offline-message.mp3");
        }
        return caches.match("/chair-islamic-t.v./index.html");
      });
    })
  );
});

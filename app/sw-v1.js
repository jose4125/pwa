self.addEventListener("install", event => {
  console.log("[service worker] installing the SW", event);
  event.waitUntil(
    caches.open("static").then(cache => {
      console.log("[service worker] caching app shell");
      cache.addAll([
        "/",
        "/index.html",
        "/scripts/index.js",
        "/css/index.css",
        "/images/logo.svg",
        "/images/noimage.jpg",
        "https://fonts.googleapis.com/css?family=Raleway:300,400,500,700|Yanone+Kaffeesatz:300,400"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[service worker] activating SW", event);
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});

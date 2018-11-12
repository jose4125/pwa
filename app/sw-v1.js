const CACHE_STATIC_NAME = "static-v2";
const CACHE_DYNAMIC_NAME = "dynamic";

self.addEventListener("install", event => {
  console.log("[service worker] installing the SW", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(cache => {
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
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[service worker] removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(res => {
            return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
              cache.put(event.request, res.clone());
              return res;
            });
          })
          .catch(err => {});
      }
    })
  );
});

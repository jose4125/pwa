importScripts("./vendor/idb.js");
importScripts("./utils/idb-database.js");

const CACHE_STATIC_NAME = "static-v6";
const CACHE_DYNAMIC_NAME = "dynamic";
const url = "https://news-pwa-86d39.firebaseio.com/news.json";
const postUrl =
  "https://us-central1-news-pwa-86d39.cloudfunctions.net/storePostData";

self.addEventListener("install", event => {
  console.log("[📟 - service worker] installing the SW 🔌", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(cache => {
      console.log("[📟 - service worker] caching app shell 🗂️");
      cache.addAll([
        "/",
        "/index.html",
        "/offline.html",
        "/new-post.html",
        "/scripts/index.js",
        "/scripts/new-post.js",
        "/vendor/idb.js",
        "/css/index.css",
        "/images/logo.svg",
        "/images/noimage.jpg",
        "https://fonts.googleapis.com/css?family=Raleway:300,400,500,700|Yanone+Kaffeesatz:300,400"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[📟 - service worker] activating SW 💡", event);
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[📟 - service worker] removing old cache 🗑️", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  // cache then network
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        const resClone = res.clone();
        database
          .clearAllData("news")
          .then(() => {
            return resClone.json();
          })
          .then(data => {
            for (let key in data) {
              database.saveData("news", data[key]);
            }
          });

        return res;
      })
    );
  } else {
    // cache with network fallback - cache falling back to the network
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
            .catch(err => {
              return caches.open(CACHE_STATIC_NAME).then(cache => {
                if (event.request.headers.get("accept").includes("text/html")) {
                  return cache.match("/offline.html");
                }
              });
            });
        }
      })
    );
  }
});

self.addEventListener("sync", event => {
  console.log("[📟 - service worker] background sync 📳", event);
  if (event.tag === "sync-new-posts") {
    console.log("[📟 - service worker] syncing new post ⚡️");
    event.waitUntil(
      database.getAllData("sync-posts").then(data => {
        for (let post of data) {
          let postData = new FormData();
          postData.append("id", post.id);
          postData.append("publishedAt", post.publishedAt);
          postData.append("title", post.title);
          postData.append("body", post.body);
          postData.append("author", post.author);
          postData.append("url", post.url);
          postData.append("file", post.imageUrl, `${post.id}.png`);

          fetch(postUrl, {
            method: "POST",
            body: postData
          })
            .then(res => {
              console.info("📟 - sent data 📬 🛎️", res);
              if (res.ok) {
                return res.clone().json();
              }
            })
            .then(data => {
              console.info("📟 - remove data 📭");
              database.deleteItemData("sync-posts", data.id);
            })
            .catch(err => {
              console.log("📟 - error while sending posts 🚨 ", err);
            });
        }
      })
    );
  }
});

self.addEventListener("notificationclick", event => {
  const notification = event.notification;
  const action = event.action;

  if (action === "confirm") {
    console.log("[📟 - service worker] confirm was chosen 🖖", notification);
    notification.close();
  } else {
    console.log("[📟 - service worker] cancel was chosen 👊");
    event.waitUntil(
      clients.matchAll().then(clients => {
        let client = clients.find(c => {
          return (c.visibilityState = "visible");
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          client.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
    notification.close();
  }
});

self.addEventListener("notificationclose", event => {
  console.log("[📟 - service worker] notification was closed 👋", event);
});

self.addEventListener("push", event => {
  console.log("[📟 - service worker] push notification recived 💬 🤘");

  let data = {
    title: "new",
    content: "something new happend!",
    openUrl: "/"
  };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  console.log("OPEN URL", data.openUrl);

  let options = {
    body: data.content,
    icon: "/images/icons/news-icon-96x96.png",
    badge: "/images/icons/news-icon-96x96.png",
    data: {
      url: data.openUrl
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

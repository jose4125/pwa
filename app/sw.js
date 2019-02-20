importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);
importScripts("./vendor/idb.js");
importScripts("./utils/idb-database.js");

workbox.routing.registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 3,
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/(?:papeersupportcoalition|cdn.theatlantic)\.(org|com)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "dummy-images"
  })
);

workbox.routing.registerRoute(
  /^https:\/\/firebasestorage\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "post-images"
  })
);

workbox.routing.registerRoute(
  "https://news-pwa-86d39.firebaseio.com/news.json",
  function(args) {
    return fetch(args.event.request).then(res => {
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
    });
  }
);

workbox.routing.registerRoute(
  function(routeData) {
    return routeData.event.request.headers.get("accept").includes("text/html");
  },
  function(args) {
    return caches.match(args.event.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(args.event.request)
          .then(res => {
            return caches.open("dynamic").then(cache => {
              cache.put(args.event.request, res.clone());
              return res;
            });
          })
          .catch(err => {
            return caches.match("/offline.html").then(res => {
              return res;
            });
          });
      }
    });
  }
);

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([
  {
    url: "404.html",
    revision: "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    url: "css/index.css",
    revision: "9847e8ccecf30a16a7b0153f73a3bb92"
  },
  {
    url: "index.html",
    revision: "b87efebf16de295a7b4cf2de038f2aaf"
  },
  {
    url: "manifest.json",
    revision: "32f4b6a2c60c887cdd63d13eb8f956e4"
  },
  {
    url: "new-post.html",
    revision: "099c279692d3ac86af0d6a343a20d8b4"
  },
  {
    url: "offline.html",
    revision: "4231a599cd2295a8bcc497387069f2d7"
  },
  {
    url: "scripts/index.js",
    revision: "1cb1b601e6de6edabe11eceb3b8ab674"
  },
  {
    url: "scripts/new-post.js",
    revision: "dd420d6c381c3bd6d21579b33b18e714"
  },
  {
    url: "scripts/register.js",
    revision: "53810b8ae407f87d6aae2f66b12074cd"
  },
  {
    url: "sw-base.js",
    revision: "867c327de976ddc18f78802902690f4c"
  },
  {
    url: "sw-v1.js",
    revision: "4e81cf441210c116d08cf705c365e920"
  },
  {
    url: "template/news-template.html",
    revision: "0c28888a94c61980f5c7e8a2266edd6c"
  },
  {
    url: "utils/dataUriToBlob.js",
    revision: "de0e3594e9b809c3b654297ac5a72534"
  },
  {
    url: "utils/idb-database.js",
    revision: "ddc63928e46bc5767dfa002813269c88"
  },
  {
    url: "utils/urlbase64-8array.js",
    revision: "2ff87651c0e83adf5ac0561569b8d654"
  },
  {
    url: "vendor/idb.js",
    revision: "62accfe655ea22d3410aaf11367b3176"
  },
  {
    url: "images/logo.svg",
    revision: "7008bf300375817c5ab9cccb61f1849b"
  },
  {
    url: "images/noimage.jpg",
    revision: "625d1aff2d58f024870ef61b95680166"
  }
]);

const postUrl =
  "https://us-central1-news-pwa-86d39.cloudfunctions.net/storePostData";

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
                return res.json();
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

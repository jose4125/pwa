# pwa

- install the http server

```sh
$ npm install http-server -g
```

- clone the repo

```sh
$ git clone https://github.com/jose4125/pwa.git
$ cd pwa/
```

- install the dependencies

```sh
$ npm install
```

- build the development app

```sh
$ npm run develop
```

- start the server in other terminal

```sh
$ npm start
```

- go to the home page

  [http://localhost:8080][home]

  [http://127.0.0.1:8080][home2]

- go to the add manifest branch

  [add manifest branch][branch1]

  - change the copy-html scritp in the package.json

  ```git
  - "copy-html": "cp app/index.html ./public/index.html",
  + "copy-html": "cp app/{index.html,manifest.json} ./public/",
  ```

  - add the manifest `<link>` in the index.html

  ```html
  + <link rel="manifest" href="/manifest.json">
  ```

  - add the `manifest.json` file in the root of our `app/`

- go to the add safari - explorer support

  [safari - explorer support][branch2]

  - add the `<meta>` and `<link>` tags in the `index.html` to support safari and explorer

- go to register sw

  [register-sw][branch3]

  - change the copy-html scritp in the package.json

  ```git
  - "copy-html": "cp app/{index.html,manifest.json} ./public/",
  + "copy-html": "cp app/{index.html,manifest.json,sw*.js} ./public/",
  ```

  - add the `register.js` file in `script/`
  - add the `sw-v1.js` file in the root of our `app/`
  - register the service worker in `register.js`

  - import the `register.js` into the `index.js`

  ```js
  import "./register";
  ```

- go to caching app shell

  [caching-app-shell][branch4]

  - add the events listeners to cache the app shell

  ```js
  self.addEventListener("install", event => {
    ...
  }

  self.addEventListener("activate", event => {
    ...
  }

  self.addEventListener("fetch", event => {
    ...
  }
  ```

- go to dynamic caching

  [dynamic-caching][branch5]

  - add the `.then()` to our fetch request to handle the response
  - add new `caches.open()` inside the `then()` function and name it `dynamic`
  - save the `request` and the `response` in our cache storage
  - return the `response` and the `caches.open()`

- go to cleaning cache

  [cleaning-cache][branch6]

  - inside the `activate` listener add `waitUntil` event
  - get the `caches.keys()` to clean the cache storage

- go to cache then network

  [cache-then-network][branch7]

  ```sh
    git checkout -t origin/7-cache-then-network
  ```

  - add `offline.html` file in the root of our `app`,
  - `index.js` add cache then network
  - `sw` add the cache then network yo get the updated data
  - `sw` get the data from the cache storage, if it not exist fetch it, and add the data to the cache storage

- go to indexedDB dynamic data

  [indexedDB-dynamic-data][branch8]

  - add the indexedDB promises library `vendors/idb.js` inside vendors folder
  - add idb helpers methods `utils/idb-database.js` inside the utils folder
  - add idb library script in the `index.html`

  ```html
  <script src="/vendor/idb.js"></script>
  ```

  - change in `sw-v1.js` and `index.js`, every `json` data that was cached when the request is completed

- go to background sync

  [background-sync][branch9]

  - install the dependencies

  ```sh
  $ npm install
  ```

  - add `new-post.html` in the root of our `app/`
  - add `new-post.js` in `app/scripts/`
  - add new post link in `index.html`

  ```html
  <a href="/new-post"> + new post</a>
  ```

  - get the form values
  - add `submit` event listener
  - check if `serviceWorker` and `SyncManager` is supported

  ```js
  if ('serviceWorker' in navigator && 'SyncManager' in window){...}
  ```

  - register the sync event

  ```js
  sw.sync.register("sync-new-posts");
  ```

  - send form data by `POST` request if `serviceWorker` and `SyncManager` is not supported
  - create the indexedDB object store called `sync-posts`

  ```js
  db.createObjectStore("sync-posts", { keyPath: "id" });
  ```

  - add the `sync` event listener in `sw-v1.js`

  ```js
  self.addEventListener('sync', event => {...}
  ```

  - get all the indexedDB data stored in `sync-posts`
  - for each one item in the store send a `POST` request

- go to web push notification

  [web-push-notification][branch10]

  - enable the browser notification
  - handle the browser notification with service worker
  - add the `notificationclick` event to handle the notification actions

  ```js
  self.addEventListener("notificationclick", event => {...}
  ```

  - add the `notificationclose` event to handle when the notification was closed

  ```js
  self.addEventListener("notificationclose", event => {...}
  ```

  - connect with push messages
  - generate subscription data and send it to the push notification service
  - add the `push` event to handle the push

  ```js
  self.addEventListener('push', event => {...}
  ```

- go to push notification one signal

  [push-notification-one-signal][branch11]

  - add video, canvas, button to capture the photo, and a label and input to upload an image as a fallback in `new-post.html`
  - get the elements previously added and save them in variables in `new-post.js`
  - add an `initializeMedia()` function to get the camera and add a polyfill to support old browsers
  - add a click listener to capture the photo

  ```js
  captureButton.addEventListener("click", function(event) {...}
  ```

  - change the way we are sending data from json to formdata in `new-post.js` and `sw-v1.js`
  - add a change listener to upload an image

  ```js
  imagePicker.addEventListener("change", event => {...}
  ```

- go to native device features xxx

  [native-device-features-xxx][branch11]

[home]: http://localhost:8080
[home2]: http://127.0.0.1:8080
[branch1]: https://github.com/jose4125/pwa/tree/1-add-manifest
[branch2]: https://github.com/jose4125/pwa/tree/2-safari-explorer-support
[branch3]: https://github.com/jose4125/pwa/tree/3-register-sw
[branch4]: https://github.com/jose4125/pwa/tree/4-caching-app-shell
[branch5]: https://github.com/jose4125/pwa/tree/5-dynamic-caching
[branch6]: https://github.com/jose4125/pwa/tree/6-cleaning-cache
[branch7]: https://github.com/jose4125/pwa/tree/7-cache-then-network
[branch8]: https://github.com/jose4125/pwa/tree/8-indexedDB-dynamic-data
[branch9]: https://github.com/jose4125/pwa/tree/9-background-sync
[branch10]: https://github.com/jose4125/pwa/tree/10-web-push-notification
[branch11]: https://github.com/jose4125/pwa/tree/11-push-notification-one-signal
[branch13]: https://github.com/jose4125/pwa/tree/13-native-device-features-xxx

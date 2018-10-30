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

[home]: http://localhost:8080
[home2]: http://127.0.0.1:8080
[branch1]: https://github.com/jose4125/pwa/tree/1-add-manifest
[branch2]: https://github.com/jose4125/pwa/tree/2-safari-explorer-support
[branch3]: https://github.com/jose4125/pwa/tree/3-register-sw
[branch4]: https://github.com/jose4125/pwa/tree/4-caching-app-shell

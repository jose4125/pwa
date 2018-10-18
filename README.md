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

- go to the add safary - explorer support

  [safary - explorer support][branch2]

[home]: http://localhost:8080
[home2]: http://127.0.0.1:8080
[branch1]: https://github.com/jose4125/pwa/tree/1-add-manifest
[branch2]: https://github.com/jose4125/pwa/tree/2-safary-explorer-support

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw-v1.js").then(() => {
    console.log("service worker registered");
  });
}

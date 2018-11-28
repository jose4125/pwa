import template from "../template/news-template.html";
import "./register";
import database from "../utils/idb-database";
import urlBase64ToUint8Array from "../utils/urlbase64-8array";

const url = "https://news-pwa-86d39.firebaseio.com/";
let networkDataReceived = false;
const subscribeButton = document.querySelectorAll(".subscribe");

fetch(`${url}news.json`)
  .then(res => {
    return res.json();
  })
  .then(data => {
    networkDataReceived = true;
    console.log("From web 🌎", data);
    let fetchData = {
      news: []
    };

    for (let item in data) {
      fetchData.news.push(data[item]);
    }
    const html = template(fetchData);
    document.querySelector(".news-container").innerHTML = html;
  });

if ("indexedDB" in window) {
  database.getAllData("news").then(data => {
    if (!networkDataReceived) {
      console.log("from cache 🗄️", data);
      let cacheData = {
        news: data
      };
      const html = template(cacheData);
      document.querySelector(".news-container").innerHTML = html;
    }
  });
}

function displayConfirmNotification() {
  // 2- service worker notification example - uncomment code below
  console.log("display confirm notification");
  if ("serviceWorker" in navigator) {
    let options = {
      body: "🤘 You successfully subscribed to our news notification service",
      icon: "/images/icons/news-icon-96x96.png",
      image:
        "https://papeersupportcoalition.org/wp-content/uploads/2017/01/6a00d83420c49153ef01b7c781a9b2970b.jpg",
      dir: "ltr",
      lang: "en-US",
      vibrate: [100, 50, 200],
      badge: "/images/icons/news-icon-96x96.png",
      tag: "news-notification",
      renotify: true,
      actions: [
        { action: "confirm", title: "ok" },
        { action: "cancel", title: "cancel" }
      ]
    };
    console.log("navigator.service worker");
    //2- service worker notification - uncomment code below
    navigator.serviceWorker.ready.then(swRegistration => {
      console.log("show notification");
      swRegistration.showNotification(
        "🔓 Successfully subscribed! [from sw 📟]",
        options
      );
    });
  }

  // 1- browser notification example - uncomment code below
  // let options = {
  //   body: 'You successfully subscribed to our news notification service'
  // }
  // new Notification('Successfully subscribed!', options)
}

// 3- connect with push messages
function configurePushSubscription() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let swReg;

  navigator.serviceWorker.ready
    .then(swRegistration => {
      swReg = swRegistration;
      return swRegistration.pushManager.getSubscription();
    })
    .then(subscriptions => {
      if (subscriptions === null) {
        const vapidPublicKey =
          "BKIKQ6gtDQrKUvbpWYr8QiOHfAkmdFHew9Fom0Pam8NSoCu0IunyBfwBJfNiC2D61ER81Zu5HhNYsvVF54nqVuA";
        const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return swReg.pushManager.subscribe({
          tag: "subscriptions",
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        console.log("test");
      }
    })
    .then(newSubscription => {
      return fetch(`${url}subscriptions.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newSubscription)
      });
    })
    .then(res => {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(err => {
      console.log("🚨 - error while sending subscription  ", err);
    });
}

function enableNotificationPermission() {
  console.log("enableNotificationPermission");
  Notification.requestPermission(result => {
    if (result !== "granted") {
      console.log("🔒 No notification permission granted 😢 👊");
    } else {
      configurePushSubscription(); //3- uncomment this when you are in step 3
      //displayConfirmNotification(); // 1- comment this when you are in step 3
    }
  });
}

if ("Notification" in window && "serviceWorker" in navigator) {
  for (let i = 0; i < subscribeButton.length; i++) {
    subscribeButton[i].style.display = "inline-block";
    subscribeButton[i].addEventListener("click", enableNotificationPermission);
  }
} else {
  for (let i = 0; i < subscribeButton.length; i++) {
    subscribeButton[i].style.display = "none";
  }
}

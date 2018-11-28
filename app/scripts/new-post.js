import "./register";
import database from "../utils/idb-database";

const postUrl =
  "https://us-central1-news-pwa-86d39.cloudfunctions.net/storePostData";
const form = document.querySelector(".new-post");
const title = document.querySelector("#title");
const body = document.querySelector("#description");
const author = document.querySelector("#author");
const newsUrl = document.querySelector("#url");

function sendData() {
  fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      id: new Date.toISOString(),
      publishedAt: Date().toISOString(),
      title: title.value,
      body: body.value,
      author: author.value,
      url: newsUrl.value,
      imageUrl:
        "https://papeersupportcoalition.org/wp-content/uploads/2017/01/6a00d83420c49153ef01b7c781a9b2970b.jpg"
    })
  }).then(res => {
    console.info("sent data", res);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  if (
    title.value.trim() === "" ||
    body.value.trim() === "" ||
    author.value.trim() === ""
  ) {
    alert("Please enter valid data");
    return;
  }

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready
      .then(sw => {
        let post = {
          id: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          title: title.value,
          body: body.value,
          author: author.value,
          url: newsUrl.value,
          imageUrl:
            "https://papeersupportcoalition.org/wp-content/uploads/2017/01/6a00d83420c49153ef01b7c781a9b2970b.jpg"
        };

        database
          .saveData("sync-posts", post)
          .then(() => {
            sw.sync.register("sync-new-posts");
          })
          .then(() => {
            console.info("📦 Your post was saved for syncing 📫");
          })
          .catch(err => {
            console.error("🚨  ERROR => ", err);
          });
      })
      .catch(err => {
        console.log("🚨  ERROR => system was unable to register for a sync 🔥");
        sendData();
      });
  } else {
    sendData();
  }
});

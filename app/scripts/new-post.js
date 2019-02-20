import "./register";
import database from "../utils/idb-database";
import dataURItoBlob from "../utils/dataUriToBlob";

const postUrl =
  "https://us-central1-news-pwa-86d39.cloudfunctions.net/storePostData";
const form = document.querySelector(".new-post");
const title = document.querySelector("#title");
const body = document.querySelector("#description");
const author = document.querySelector("#author");
const newsUrl = document.querySelector("#url");
const videoPlayer = document.querySelector(".camera-photo");
const canvasElement = document.querySelector(".canvas-photo");
const captureButton = document.querySelector(".photo-button");
const imagePickerArea = document.querySelector(".pick-image");
const imagePicker = document.querySelector(".image-picker");

let picture;

function initializeMedia() {
  if (!("mediaDevices" in navigator)) {
    navigator.mediaDevices = {};
  }

  if (!("getUserMedia" in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error("getUserMedia is not implemented!"));
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = "block";
    })
    .catch(function(err) {
      imagePickerArea.style.display = "block";
    });
}

captureButton.addEventListener("click", function(event) {
  canvasElement.style.display = "block";
  videoPlayer.style.display = "none";
  captureButton.style.display = "none";
  var context = canvasElement.getContext("2d");
  context.drawImage(
    videoPlayer,
    0,
    0,
    canvas.width,
    videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
  );
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  picture = dataURItoBlob(canvasElement.toDataURL());
});

imagePicker.addEventListener("change", event => {
  picture = event.target.files[0];
});

function sendData() {
  console.log("picture", picture);
  const date = new Date().toISOString();
  let postData = new FormData();
  postData.append("id", date);
  postData.append("publishedAt", date);
  postData.append("title", title.value);
  postData.append("body", body.value);
  postData.append("author", author.value);
  postData.append("url", newsUrl.value);
  postData.append("file", picture, `${date}.png`);

  console.log("postData", postData);

  fetch(postUrl, {
    method: "POST",
    body: postData
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
          imageUrl: picture
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

initializeMedia();

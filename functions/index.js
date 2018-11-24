const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const webPush = require("web-push");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const mailTo = "mailto:jose4125@gmail.com";
const vapidKey = "lmmKhmamYZ9BPB7-PyddWauEbDkjlRPg6QL7PzdTEUM";
const vapidPublicKey =
  "BKIKQ6gtDQrKUvbpWYr8QiOHfAkmdFHew9Fom0Pam8NSoCu0IunyBfwBJfNiC2D61ER81Zu5HhNYsvVF54nqVuA";

admin.initializeApp(functions.config().firebase);

exports.storePostData = functions.https.onRequest((req, res) => {
  let { id, title, body, publishedAt, author, url, imageUrl } = req.body;
  cors(req, res, () => {
    admin
      .database()
      .ref("news")
      .push({
        id,
        title,
        body,
        publishedAt,
        author,
        url,
        imageUrl
      })
      .then(() => {
        webPush.setVapidDetails(mailTo, vapidPublicKey, vapidKey);
        return admin
          .database()
          .ref("subscriptions")
          .once("value");
      })
      .then(subscriptions => {
        subscriptions.forEach(subscription => {
          let pushConfig = {
            endpoint: subscription.val().endpoint,
            keys: {
              auth: subscription.val().keys.auth,
              p256dh: subscription.val().keys.p256dh
            }
          };
          webPush
            .sendNotification(
              pushConfig,
              JSON.stringify({
                title: `New post added by ${author}!`,
                content: title,
                openUrl: url
              })
            )
            .catch(err => {
              console.error("error while sending notification 🚨", err);
            });
        });
        res.status(201).json({ message: "data stored", id: req.body.id });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });
});

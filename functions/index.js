const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

let serviceAccount = require("./news-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://news-d62a0.firebaseio.com/"
});

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
        res.status(201).json({ message: "data stored", id: req.body.id });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });
});

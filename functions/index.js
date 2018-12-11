const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const cors = require("cors")({ origin: true });
const webPush = require("web-push");
const fs = require("fs");
const os = require("os");
const Busboy = require("busboy");
const path = require("path");
var UUID = require("uuid-v4");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const mailTo = "mailto:jose4125@gmail.com";
const vapidKey = "lmmKhmamYZ9BPB7-PyddWauEbDkjlRPg6QL7PzdTEUM";
const vapidPublicKey =
  "BKIKQ6gtDQrKUvbpWYr8QiOHfAkmdFHew9Fom0Pam8NSoCu0IunyBfwBJfNiC2D61ER81Zu5HhNYsvVF54nqVuA";

const googleCloudConfig = {
  projectId: "news-pwa-86d39",
  keyFilename: functions.config().firebase
};

admin.initializeApp(functions.config().firebase);

const googleCloudStorage = new Storage(googleCloudConfig);

function storeData(fields, res, uuid, uploadedFile, bucket) {
  admin
    .database()
    .ref("news")
    .push({
      id: fields.id,
      title: fields.title,
      body: fields.body,
      publishedAt: fields.publishedAt,
      author: fields.author,
      url: fields.url,
      imageUrl: bucket
        ? `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(uploadedFile.name)}?alt=media&token=${uuid}`
        : "http://msigrupo.com/wp-content/uploads/2015/09/news-msi.jpg"
    })
    .then(function() {
      console.log("SAVED ============");
      webPush.setVapidDetails(mailTo, vapidPublicKey, vapidKey);
      return admin
        .database()
        .ref("subscriptions")
        .once("value");
    })
    .then(function(subscriptions) {
      console.log("subscriptions ============");
      subscriptions.forEach(function(sub) {
        var pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh
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
          .catch(function(err) {
            console.error("error while sending notification 🚨", err);
          });
      });
      console.log("SUCCESS ============");
      res.status(201).json({ message: "Data stored", id: fields.id });
    })
    .catch(function(err) {
      console.log("ERROR ============");
      res.status(500).json({ error: err });
    });
}

exports.storePostData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const uuid = UUID();

    const busboy = new Busboy({ headers: req.headers });

    let upload;
    const fields = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log(
        `File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
      );
      const filepath = path.join(os.tmpdir(), filename);
      upload = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("field", function(
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      fields[fieldname] = val;
    });

    busboy.on("finish", () => {
      var bucket = googleCloudStorage.bucket("news-pwa-86d39.appspot.com");
      if (upload && upload.file) {
        bucket.upload(
          upload.file,
          {
            uploadType: "media",
            metadata: {
              metadata: {
                contentType: upload.type,
                firebaseStorageDownloadTokens: uuid
              }
            }
          },
          function(err, uploadedFile) {
            if (!err) {
              storeData(fields, res, uuid, uploadedFile, bucket);
            } else {
              console.log(err);
            }
          }
        );
      } else {
        storeData(fields, res);
      }
    });
    busboy.end(req.rawBody);
  });
});

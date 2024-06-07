const admin = require("firebase-admin");

const serviceAccount = require("./private/cl-dev-pk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_APP_FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const rtdb = admin.database();

module.exports = {
  db,
  rtdb,
  admin
};

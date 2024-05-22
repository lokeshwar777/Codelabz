import { initializeApp, credential as _credential, firestore, database } from "firebase-admin";

import serviceAccount from "./private/cl-dev-pk.json";
initializeApp({
  credential: _credential.cert(serviceAccount),
  databaseURL: process.env.VITE_APP_DATABASE_URL
});

const db = firestore();
const rtdb = database();

export default {
  db,
  rtdb,
  admin
};

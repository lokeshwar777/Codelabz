import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";
import "firebase/compat/analytics";
import "firebase/compat/performance";
import "firebase/compat/messaging";
import { initializeApp } from "firebase/app";
import { onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENTID
};

// console.log("firebaseConfig", firebaseConfig);

export const onlineFirebaseApp = initializeApp(firebaseConfig, "secondary");

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

if (import.meta.env.VITE_APP_FIREBASE_USE_EMULATOR === "true") {
  console.log("Using emulator");
  firebase.firestore().useEmulator("localhost", 8080);
  firebase.auth().useEmulator("http://localhost:9099", { disableWarnings: true });
  firebase.database().useEmulator("localhost", 9000);
  // firebase.functions().useEmulator("localhost", 5001);
  db.settings({ merge: true });
}

// Test Firebase Analytics
const testAnalytics = () => {
  try {
    firebase.analytics().logEvent('test_event', { test_param: 'test_value' });
    console.log('Analytics connected and event logged.');
  } catch (error) {
    console.error('Error with Analytics:', error);
  }
};

let firebase_messaging;
export const functions = firebase.functions();

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      if (firebase.messaging.isSupported()) {
        firebase_messaging = firebase.messaging();
        firebase_messaging.getToken({
          vapidKey: import.meta.env.VITE_APP_FIREBASE_FCM_VAPID_KEY
        })
          .then(curToken => {
            if (curToken) {
              console.log("FCM token:", curToken);
            } else {
              console.log("Error in getting FCM token.");
            }
          })
          .catch(err => console.log("FCM token error:", err));
      } else {
        console.log("Messaging not supported.");
      }
    }
  });
}
// requestPermission(); // uncomment this to request permission for notifications

export const onMessageListener = () =>
  new Promise(resolve => {
    onMessage(firebase_messaging, payload => {
      resolve(payload);
    });
  });

export const messaging = firebase_messaging;

// Test Firebase Auth
const testAuth = () => {
  firebase.auth().signInAnonymously()
    .then(() => {
      console.log("Auth connected and signed in anonymously.");
    })
    .catch(error => {
      console.error("Error with Auth:", error);
    });
};

// Test Performance Monitoring
const testPerformance = () => {
  try {
    const trace = firebase.performance().trace('test_trace');
    trace.start();
    setTimeout(() => {
      trace.stop();
      console.log('Performance Monitoring connected and trace completed.');
    }, 1000);
  } catch (error) {
    console.error('Error with Performance Monitoring:', error);
  }
};

// Test Firestore
const testFirestore = () => {
  const docRef = db.collection('testConnection').doc('testDoc');
  docRef.set({ test: "This is a test data" })
    .then(() => {
      console.log('Firestore connected and data written.');
      return docRef.get();
    })
    .then(doc => {
      if (doc.exists) {
        console.log('Firestore data read:', doc.data());
      } else {
        console.log('No such document in Firestore.');
      }
    })
    .catch(error => {
      console.error('Error with Firestore:', error);
    });
};

// Test Firebase Realtime Database
const testRealtimeDatabase = () => {
  const dbRef = firebase.database().ref('testConnection');
  dbRef.set({ test: "This is a test data" })
    .then(() => {
      console.log('Realtime Database connected and data written.');
      return dbRef.once('value');
    })
    .then(snapshot => {
      console.log('Realtime Database data read:', snapshot.val());
    })
    .catch(error => {
      console.error('Error with Realtime Database:', error);
    });
};

// Test Firebase Storage
const testStorage = () => {
  const storageRef = firebase.storage().ref().child('testConnection/testFile.txt');
  storageRef.putString('This is a test file')
    .then(snapshot => {
      console.log('Storage connected and file uploaded.');
      return storageRef.getDownloadURL();
    })
    .then(url => {
      console.log('Storage file URL:', url);
    })
    .catch(error => {
      console.error('Error with Storage:', error);
    });
};

// Test Cloud Functions
const testFunctions = () => {
  const testFunction = firebase.functions().httpsCallable('testFunction');
  testFunction({ message: "This is a test message" })
    .then(result => {
      console.log('Functions connected and function called:', result.data);
    })
    .catch(error => {
      console.error('Error with Functions:', error);
    });
};

// uncomment the below to run all tests for checking whether your firebase services are connected and working properly
// testAuth();
// testRealtimeDatabase();
// testFirestore();
// testStorage();
// testFunctions(); // this will not work as it requires blaze plan
// testAnalytics();
// testPerformance();

export default firebase;

// netlify/functions/firebase.js
const admin = require('firebase-admin');


const firebaseConfig = {
    apiKey: "AIzaSyBoPAyG-HKt-eVh-v70fFwRAZmG-8Cbur0",
    authDomain: "adcontent-2b1fd.firebaseapp.com",
    projectId: "adcontent-2b1fd",
    storageBucket: "adcontent-2b1fd.firebasestorage.app",
    messagingSenderId: "29738593443",
    appId: "1:29738593443:web:1ac2c369e9da344128a316"
  };
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = firebaseConfig // Download this from Firebase Console > Project Settings > Service Accounts
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'YOUR_DATABASE_URL', // Replace with your Realtime Database URL
  });
}

const db = admin.database();
module.exports = db;
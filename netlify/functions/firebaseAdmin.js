// firebaseAdmin.js
const admin = require("firebase-admin");

// Check if Firebase has already been initialized to prevent re-initializing
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adcontent-2b1fd-default-rtdb.firebaseio.com", // Replace with your database URL
  });
}

module.exports = admin;

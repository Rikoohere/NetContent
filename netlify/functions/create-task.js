const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: "https://adcontent-2b1fd-default-rtdb.firebaseio.com", // Add your Realtime Database URL
  });
}

const db = admin.database();

exports.handler = async () => {
  try {
    const taskId = `task-${Date.now()}`;
    const taskRef = db.ref(`tasks/${taskId}`);

    await taskRef.set({
      email: null,
      password: null,
      createdAt: Date.now(),
      status: "pending",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskId }),
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to create task." }),
    };
  }
};

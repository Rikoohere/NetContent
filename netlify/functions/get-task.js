const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: "https://adcontent-2b1fd-default-rtdb.firebaseio.com", // Add your Realtime Database URL
  });
}

const db = admin.database();

exports.handler = async (event) => {
  const taskId = event.queryStringParameters.taskId;

  if (!taskId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Task ID is required." }),
    };
  }

  try {
    const taskRef = db.ref(`tasks/${taskId}`);
    const snapshot = await taskRef.once("value");

    if (!snapshot.exists()) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Task not found." }),
      };
    }

    const taskData = snapshot.val();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...taskData }),
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to fetch task." }),
    };
  }
};

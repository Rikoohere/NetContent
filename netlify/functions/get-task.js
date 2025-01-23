const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  const taskId = event.queryStringParameters.taskId;

  if (!taskId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Task ID is required." }),
    };
  }

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Task not found." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...taskDoc.data() }),
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to fetch task." }),
    };
  }
};

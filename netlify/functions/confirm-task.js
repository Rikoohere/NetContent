const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  const { taskId, email, password } = JSON.parse(event.body);

  if (!taskId || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Task ID, email, and password are required.",
      }),
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

    await taskRef.update({
      email,
      password,
      status: "completed",
      completedAt: Date.now(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Task updated successfully." }),
    };
  } catch (error) {
    console.error("Error confirming task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to update task." }),
    };
  }
};

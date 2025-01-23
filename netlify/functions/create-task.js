const admin = require('../firebaseAdmin');

exports.handler = async (event, context) => {
  const { taskId, email, password } = JSON.parse(event.body);

  if (!taskId || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing task details' }),
    };
  }

  try {
    const taskRef = admin.database().ref(`tasks/${taskId}`);
    await taskRef.update({ email, password, status: 'completed', completedAt: admin.firestore.FieldValue.serverTimestamp() });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task submitted successfully' }),
    };
  } catch (error) {
    console.error('Error confirming task:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error confirming task' }),
    };
  }
};

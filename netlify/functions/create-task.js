// netlify/functions/create-task.js
const db = require('./firebase');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const taskId = Date.now().toString(); // Generate a unique task ID
    const task = {
      taskId,
      status: 'pending',
      date: new Date().toISOString(),
      email: null,
      password: null,
    };

    // Save the task to Firebase Realtime Database
    await db.ref(`tasks/${taskId}`).set(task);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  }
};
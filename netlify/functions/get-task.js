// netlify/functions/get-task.js
const db = require('./firebase');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { taskId } = event.queryStringParameters;

    // Retrieve the task from Firebase
    const snapshot = await db.ref(`tasks/${taskId}`).once('value');
    const task = snapshot.val();

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Task not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        email: task.email,
        password: task.password,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  }
};
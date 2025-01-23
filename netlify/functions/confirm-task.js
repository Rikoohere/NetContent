// netlify/functions/confirm-task.js
const db = require('./firebase');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { taskId } = JSON.parse(event.body);

    // Update the task status in Firebase
    await db.ref(`tasks/${taskId}`).update({ status: 'ready' });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task confirmed successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  }
};
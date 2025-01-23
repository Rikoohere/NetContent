const admin = require('../firebaseAdmin');

exports.handler = async (event, context) => {
  const { taskId } = event.queryStringParameters;

  if (!taskId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Task ID is required' }),
    };
  }

  try {
    const taskSnapshot = await admin.database().ref(`tasks/${taskId}`).once('value');
    const taskData = taskSnapshot.val();

    if (!taskData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Task not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskData }),
    };
  } catch (error) {
    console.error('Error fetching task details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error fetching task details' }),
    };
  }
};

const tasks = require('./tasks');

exports.handler = async (event, context) => {
  const { taskId } = event.queryStringParameters;

  if (!taskId || !tasks[taskId]) {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: 'Task not found.' }),
    };
  }

  const task = tasks[taskId];
  if (task.status === 'completed') {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, email: task.email, password: task.password }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: 'Waiting for admin response.' }),
    };
  }
};
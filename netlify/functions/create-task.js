// netlify/functions/create-task.js
exports.handler = async (event, context) => {
  try {
    // Generate a random task ID (you might use a more robust method in production)
    const taskId = `task-${Math.floor(Math.random() * 10000)}`;

    // Save the task info to a database or storage (e.g., Firebase, MongoDB, etc.)
    // For simplicity, here we're just sending back the taskId

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskId }),
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to create task' }),
    };
  }
};

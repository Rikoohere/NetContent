// netlify/functions/update-task.js
exports.handler = async (event, context) => {
    const { taskId, email, password } = JSON.parse(event.body);
  
    if (!taskId || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Missing task details' }),
      };
    }
  
    try {
      // Update the task status in your database
      console.log(`Task ${taskId} updated with email: ${email} and password: ${password}`);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Task updated successfully' }),
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Error updating task' }),
      };
    }
  };
  
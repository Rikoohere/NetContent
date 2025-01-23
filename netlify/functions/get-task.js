// netlify/functions/get-task.js
exports.handler = async (event, context) => {
  const { taskId } = event.queryStringParameters;
  
  if (!taskId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Task ID is required' }),
    };
  }

  try {
    // Simulate waiting for account details (in a real scenario, query the database)
    // For now, we'll simulate that after a delay, account details are found
    const fakeEmail = 'user@example.com';
    const fakePassword = 'password123';

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        email: fakeEmail,
        password: fakePassword,
      }),
    };
  } catch (error) {
    console.error('Error fetching task details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error fetching task details' }),
    };
  }
};

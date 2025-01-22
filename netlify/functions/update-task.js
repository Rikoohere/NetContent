const tasks = {}; // In-memory storage (replace with a database in production)

exports.handler = async (event, context) => {
  const { taskId, email, password } = JSON.parse(event.body);

  if (!taskId || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'All fields are required.' }),
    };
  }

  // Update the task with email and password
  tasks[taskId] = { status: 'completed', email, password };

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Email and password updated.' }),
  };
};
// update-task.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const tasks = require('./tasks'); // Shared tasks object

// Function to call the update-task Netlify function
const updateTask = async (taskId, email, password) => {
  try {
    const response = await axios.post('https://your-netlify-site.netlify.app/.netlify/functions/update-task', {
      taskId,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

// Handle Telegram messages
exports.handler = async (event, context) => {
  const { message } = event.body;

  if (!message || !message.text) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: 'Invalid message.' }),
    };
  }

  const chatId = message.chat.id;
  const text = message.text;

  // Handle /respond command
  if (text.startsWith('/respond')) {
    const [_, taskId, email, password] = text.split(' ');

    if (!taskId || !email || !password) {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: 'Invalid format. Use: /respond <taskId> <email> <password>',
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: 'Invalid format.' }),
      };
    }

    // Call the update-task function
    const updateResult = await updateTask(taskId, email, password);

    if (updateResult && updateResult.success) {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: `✅ Task updated successfully!\nTask ID: ${taskId}\nEmail: ${email}\nPassword: ${password}`,
      });
    } else {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: 'Failed to update task. Please try again.',
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task updated.' }),
    };
  }

  // Handle /start command
  if (text === '/start') {
    const taskId = uuidv4(); // Generate a unique task ID

    // Store the task in memory
    tasks[taskId] = { status: 'pending' };

    // Notify admin via Telegram
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: process.env.ADMIN_CHAT_ID,
      text: `📝 New Task Request!\nTask ID: ${taskId}\nPlease respond with:\n/respond ${taskId} <email> <password>`,
    });

    // Notify user
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: 'Your request has been received. Please wait for the email and password.',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskId }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: false, message: 'Unknown command.' }),
  };
};
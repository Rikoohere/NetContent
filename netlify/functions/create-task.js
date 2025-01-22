const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const tasks = require('./tasks'); // Shared tasks object

exports.handler = async (event, context) => {
  const taskId = uuidv4(); // Generate a unique task ID

  try {
    // Store the task in memory
    tasks[taskId] = { status: 'pending' };

    // Notify admin via Telegram
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: process.env.ADMIN_CHAT_ID,
      text: `📝 New Task Request!\nTask ID: ${taskId}\nPlease respond with:\n/respond ${taskId} <email> <password>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, taskId }),
    };
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to create task.' }),
    };
  }
};
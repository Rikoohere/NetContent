const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { firstName, lastName, day, month, year } = JSON.parse(event.body);

  if (!firstName || !lastName || !day || !month || !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'All fields are required' }),
    };
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    // Send a message to the Telegram bot
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '➕ Register a new Gmail',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      // Parse the bot's response to extract email and password
      const botResponse = data.result.text;

      // Example parsing logic (adjust based on the actual response format)
      const emailMatch = botResponse.match(/Email: (.*)/);
      const passwordMatch = botResponse.match(/Password: (.*)/);

      if (emailMatch && passwordMatch) {
        const email = emailMatch[1].trim();
        const password = passwordMatch[1].trim();

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, email, password }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, message: 'Failed to parse email and password from Telegram bot response' }),
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Failed to send message to Telegram bot' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error communicating with Telegram bot' }),
    };
  }
};
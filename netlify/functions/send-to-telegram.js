const TgFancy = require('tgfancy');

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

  const apiId = process.env.TELEGRAM_API_ID; // Get this from https://my.telegram.org
  const apiHash = process.env.TELEGRAM_API_HASH; // Get this from https://my.telegram.org
  const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER; // Your Telegram account phone number
  const botUsername = process.env.TELEGRAM_BOT_USERNAME; // The username of the bot (e.g., @mybot)

  const client = new TgFancy({
    apiId,
    apiHash,
  });

  try {
    // Start the client and log in
    await client.start({
      phoneNumber,
    });

    // Send a message to the bot
    await client.sendMessage(botUsername, '➕ Register a new Gmail');

    // Listen for the bot's response
    const response = await new Promise((resolve) => {
      client.on('message', (msg) => {
        if (msg.sender.username === botUsername.replace('@', '')) {
          resolve(msg);
        }
      });
    });

    // Log the bot's response for debugging
    console.log('Bot Response:', response);

    // Extract email and password from the bot's response
    const emailMatch = response.text.match(/Email: (.*)/);
    const passwordMatch = response.text.match(/Password: (.*)/);

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
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    };
  } finally {
    // Disconnect the client
    if (client) {
      await client.destroy();
    }
  }
};
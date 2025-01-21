const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { key, date, timeTaken } = JSON.parse(event.body);
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL1;

  const message = {
    content: `🎉 Task Completed! 🎉\n**Key:** ${key}\n**Date:** ${date}\n**Time Taken:** ${timeTaken} seconds`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Failed to send data to Discord' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error sending data to Discord' }),
    };
  }
};
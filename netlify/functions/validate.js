const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const body = JSON.parse(event.body);
  const userAnswer = body.answer;
  const token = body.token;

  try {
    // Verify the token and retrieve the CAPTCHA answer
    const decoded = jwt.verify(token, SECRET);
    const captchaAnswer = decoded.answer;

    if (userAnswer === captchaAnswer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Invalid or expired token' }),
    };
  }
};
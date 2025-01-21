const svgCaptcha = require('svg-captcha');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Generate a new CAPTCHA
  const captcha = svgCaptcha.create();

  // Set a cookie with the CAPTCHA answer
  const cookie = `captchaAnswer=${captcha.text}; Path=/; HttpOnly; SameSite=Strict; Max-Age=300`; // Expires in 5 minutes

  // Return the CAPTCHA image as an SVG with the cookie
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Set-Cookie': cookie,
    },
    body: captcha.data,
  };
};
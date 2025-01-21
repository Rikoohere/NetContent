const svgCaptcha = require('svg-captcha');

exports.handler = async (event, context) => {
  // Check if the HTTP method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Generate a new CAPTCHA
  const captcha = svgCaptcha.create();

  // Return the CAPTCHA image as an SVG
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'image/svg+xml' },
    body: captcha.data,
  };
};
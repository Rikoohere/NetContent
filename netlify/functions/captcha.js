const svgCaptcha = require('svg-captcha');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Generate a new CAPTCHA
  const captcha = svgCaptcha.create();

  // Create a signed token with the CAPTCHA answer
  const token = jwt.sign({ answer: captcha.text }, SECRET, { expiresIn: '5m' });

  // Return the CAPTCHA image as an SVG with the token
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: captcha.data, token }),
  };
};
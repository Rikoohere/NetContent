const svgCaptcha = require('svg-captcha');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.strexports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Get out!.' }),
  };
};ingify({ message: 'Method Not Allowed' }),
    };
  }

  const captcha = svgCaptcha.create();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'image/svg+xml' },
    body: captcha.data,
  };
};
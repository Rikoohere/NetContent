const svgCaptcha = require('svg-captcha');

let currentCaptchaAnswer = '';
let userHearts = 3;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const body = JSON.parse(event.body);
  const userAnswer = body.answer;

  if (userAnswer === currentCaptchaAnswer) {
    const captcha = svgCaptcha.create();
    currentCaptchaAnswer = captcha.text;
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, captcha: captcha.data }),
    };
  } else {
    userHearts -= 1;
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, hearts: userHearts }),
    };
  }
};
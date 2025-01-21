exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }
  
    // Parse the CAPTCHA answer from the cookie
    const cookies = event.headers.cookie || '';
    const captchaAnswer = cookies
      .split(';')
      .find(c => c.trim().startsWith('captchaAnswer='))
      ?.split('=')[1];
  
    const body = JSON.parse(event.body);
    const userAnswer = body.answer;
  
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
  };
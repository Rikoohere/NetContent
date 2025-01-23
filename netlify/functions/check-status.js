// netlify/functions/check-status.js
exports.handler = async (event, context) => {
    try {
      // Here, you might make a request to check if a database, API, or other service is up
      // This is a simple "always online" check for now
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } catch (error) {
      console.error('Error checking status:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Service is offline' }),
      };
    }
  };
  
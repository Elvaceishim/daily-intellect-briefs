// netlify/functions/debug.ts
export const handler = async () => {
  console.log('Debug function executed at:', new Date().toISOString());
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Debug function executed successfully',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        hasResendKey: Boolean(process.env.VITE_RESEND_API_KEY),
        hasNewsApiKey: Boolean(process.env.VITE_NEWS_API_KEY)
      }
    })
  };
};
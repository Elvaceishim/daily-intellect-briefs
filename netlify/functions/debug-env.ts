// netlify/functions/debug-env.ts
export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      envVars: {
        // List all expected env vars (without showing full values)
        hasGnewsApiKey: Boolean(process.env.GNEWS_API_KEY),
        hasViteGnewsApiKey: Boolean(process.env.VITE_GNEWS_API_KEY),
        gnewsKeyPrefix: process.env.GNEWS_API_KEY?.substring(0, 3) + '...',
        hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
        hasViteResendApiKey: Boolean(process.env.VITE_RESEND_API_KEY)
      }
    })
  };
};
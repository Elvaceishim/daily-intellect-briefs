// netlify/functions/daily-digest-scheduler.ts
import { UserService } from '../../src/services/userService';
import { NewsService } from '../../src/services/newsService';
import { EmailService } from '../../src/services/emailService';

export const handler = async () => {
  try {
    const userService = new UserService();
    const newsService = new NewsService();
    const emailService = new EmailService();
    
    // Get all users who have enabled email delivery
    const activeUsers = await userService.getAllActiveSubscribers();
    console.log(`Found ${activeUsers.length} active subscribers`);
    
    const results = [];
    
    // Process each user
    for (const user of activeUsers) {
      console.log(`Processing digest for ${user.email}`);
      
      try {
        const formats = user.preferences.deliveryFormats || ['web'];
        // Get personalized news based on user preferences
        const newsItems = await newsService.fetchNews(
          user.preferences.selectedTopics, 
          8 // Number of articles per digest
        );
        
        if (newsItems.length === 0) {
          console.warn(`No news found for ${user.email}`);
          results.push({ email: user.email, success: false, error: 'No news items found' });
          continue;
        }
        
        // Send personalized email
        if (formats.includes('email')) {
          const result = await emailService.sendDailyDigest(
            user.email,
            user.name,
            newsItems,
            user.preferences.selectedTopics
          );
          
          results.push({
            email: user.email,
            success: result.success,
            messageId: result.id
          });
        }
        if (formats.includes('web')) {
          // Save/update user's dashboard data in DB
        }
        if (formats.includes('shareable')) {
          // Generate a unique shareable link and email or display it
        }
        if (formats.includes('tweet')) {
          // Generate a tweetable TL;DR and offer a "Tweet this" button/link
        }
      } catch (error) {
        console.error(`Error processing digest for ${user.email}:`, error);
        results.push({ 
          email: user.email, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        processed: results.length,
        successful: results.filter(r => r.success).length,
        results
      })
    };
  } catch (error) {
    console.error('Error in daily digest scheduler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process daily digests' })
    };
  }
};

// Run at 8 AM daily
export const schedule = "0 8 * * *";
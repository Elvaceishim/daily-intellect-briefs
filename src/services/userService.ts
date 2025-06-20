export interface UserPreferences {
  selectedTopics: string[];
  emailEnabled: boolean;
}

export interface User {
  email: string;
  name: string;
  preferences: UserPreferences;
}

export class UserService {
  // Mock user data - in production, you would fetch from a database
  private users: User[] = [
    {
      email: 'your-email@example.com', // Replace with your email for testing
      name: 'Test User',
      preferences: {
        selectedTopics: ['technology', 'business', 'science'],
        emailEnabled: true
      }
    }
  ];

  async getActiveUsers(): Promise<User[]> {
    // In a real app, fetch from database/API
    return this.users.filter(user => user.preferences.emailEnabled);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }
}

export default UserService;
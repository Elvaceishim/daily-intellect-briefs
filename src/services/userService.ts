export interface UserPreferences {
  deliveryFormats?: string[];
  selectedTopics: string[];
  emailEnabled: boolean;
  emailFrequency?: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export class UserService {
  getAllUsers() {
    throw new Error('Method not implemented.');
  }
  updateLastEmailSent(email: any) {
    throw new Error('Method not implemented.');
  }
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

  async getAllActiveSubscribers(): Promise<User[]> {
    // During development, you could return a test array
    return [
      {
        id: '1',
        email: 'anselmelvis62@gmail.com',
        name: 'Ansel',
        preferences: {
          selectedTopics: ['technology', 'business'],
          emailEnabled: true,
          emailFrequency: 'daily'
        }
      },
      // Add more test users when needed
    ];
  }
}

export default UserService;
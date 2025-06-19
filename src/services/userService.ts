interface User {
  email: string;
  name?: string;
  preferences: {
    selectedTopics: string[];
    preferredTime: string;
    emailEnabled: boolean;
  };
  createdAt: string;
  lastEmailSent?: string;
}

export class UserService {
  // In production, this would connect to your database
  // For now, we'll use a simple JSON store approach
  
  async getAllUsers(): Promise<User[]> {
    // This is a placeholder - in production you'd query your database
    // For testing, you can return some mock users
    return [
      {
        email: "test@example.com",
        name: "Test User",
        preferences: {
          selectedTopics: ["technology", "business"],
          preferredTime: "08:00",
          emailEnabled: true
        },
        createdAt: new Date().toISOString()
      }
    ];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  async updateUserPreferences(email: string, preferences: Partial<User['preferences']>): Promise<boolean> {
    // In production, update the database
    console.log(`Updating preferences for ${email}:`, preferences);
    return true;
  }

  async addUser(user: Omit<User, 'createdAt'>): Promise<boolean> {
    // In production, add to database
    console.log(`Adding new user:`, user);
    return true;
  }

  async updateLastEmailSent(email: string): Promise<boolean> {
    // In production, update the database
    console.log(`Updated last email sent for ${email}:`, new Date().toISOString());
    return true;
  }
}
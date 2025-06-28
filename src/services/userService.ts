import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface User {
  email: string;
  name?: string;
  preferences: {
    selectedTopics: string[];
    preferredTime: string;
    emailEnabled: boolean;
  };
  createdat: string;
  lastEmailSent?: string;
}

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data as User[];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data as User;
  }

  async updateUserPreferences(email: string, preferences: Partial<User['preferences']>): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('email', email);
    if (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
    return true;
  }

  async addUser(user: Omit<User, 'createdat'>): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .insert([{ ...user, createdat: new Date().toISOString() }]);
    if (error) {
      console.error('Error adding user:', error);
      return false;
    }
    return true;
  }

  async updateLastEmailSent(email: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ lastEmailSent: new Date().toISOString() })
      .eq('email', email);
    if (error) {
      console.error('Error updating lastEmailSent:', error);
      return false;
    }
    return true;
  }
}
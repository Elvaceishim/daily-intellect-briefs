// src/types/User.ts
export interface UserPreferences {
  selectedTopics: string[];
  emailEnabled: boolean;
  deliveryFormats: Array<'web' | 'email' | 'shareable' | 'tweet'>;
}
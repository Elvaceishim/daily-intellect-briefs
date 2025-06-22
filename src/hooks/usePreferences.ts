import { useState, useEffect } from 'react';

export interface UserPreferences {
  selectedTopics: string[];
  frequency: 'daily' | 'weekly' | 'bi-weekly';
  preferredTime: string;
  tone: 'casual' | 'professional' | 'technical';
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

const defaultPreferences: UserPreferences = {
  selectedTopics: ['tech', 'ai'],
  frequency: 'daily',
  preferredTime: '08:00',
  tone: 'professional',
  emailNotifications: true,
  whatsappNotifications: false
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: UserPreferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  // Update specific preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    return savePreferences(newPreferences);
  };

  // Get formatted preferences for display
  const getFormattedPreferences = () => {
    return {
      ...preferences,
      frequencyText: preferences.frequency.charAt(0).toUpperCase() + preferences.frequency.slice(1),
      timeText: new Date(`2000-01-01T${preferences.preferredTime}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      toneText: preferences.tone.charAt(0).toUpperCase() + preferences.tone.slice(1)
    };
  };

  return {
    preferences,
    isLoading,
    savePreferences,
    updatePreference,
    getFormattedPreferences
  };
};
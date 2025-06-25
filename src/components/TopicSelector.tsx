import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Alert
} from '@mui/material';
import { Settings, Check } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface UserPreferences {
  selectedTopics: string[];
  frequency: 'daily' | 'weekly' | 'bi-weekly';
  preferredTime: string;
  tone: 'casual' | 'professional' | 'technical';
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

const availableTopics: Topic[] = [
  { id: 'tech', name: 'Technology', description: 'Latest in tech innovation', icon: '💻', color: '#2563eb' },
  { id: 'ai', name: 'Artificial Intelligence', description: 'AI breakthroughs and trends', icon: '🤖', color: '#7c3aed' },
  { id: 'finance', name: 'Finance', description: 'Market news and analysis', icon: '💰', color: '#059669' },
  { id: 'crypto', name: 'Cryptocurrency', description: 'Digital currency updates', icon: '₿', color: '#f59e0b' },
  { id: 'politics', name: 'Politics', description: 'Political news and policy', icon: '🏛️', color: '#dc2626' },
  { id: 'health', name: 'Health & Medicine', description: 'Healthcare innovations', icon: '⚕️', color: '#10b981' },
  { id: 'science', name: 'Science', description: 'Scientific discoveries', icon: '🔬', color: '#3b82f6' },
  { id: 'business', name: 'Business', description: 'Corporate and startup news', icon: '📈', color: '#8b5cf6' },
  { id: 'environment', name: 'Environment', description: 'Climate and sustainability', icon: '🌱', color: '#22c55e' },
  { id: 'sports', name: 'Sports', description: 'Sports news and updates', icon: '⚽', color: '#ef4444' },
  { id: 'entertainment', name: 'Entertainment', description: 'Movies, music, and culture', icon: '🎬', color: '#f97316' },
  { id: 'education', name: 'Education', description: 'Learning and academia', icon: '📚', color: '#6366f1' }
];

const defaultPreferences: UserPreferences = {
  selectedTopics: ['tech', 'ai'],
  frequency: 'daily',
  preferredTime: '08:00',
  tone: 'professional',
  emailNotifications: true,
  whatsappNotifications: false
};

const TopicSelector = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = () => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleTopic = (topicId: string) => {
    setPreferences(prev => {
      const newSelectedTopics = prev.selectedTopics.includes(topicId)
        ? prev.selectedTopics.filter(id => id !== topicId)
        : [...prev.selectedTopics, topicId];
      
      setHasChanges(true);
      return { ...prev, selectedTopics: newSelectedTopics };
    });
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const getSelectedTopicsData = () => {
    return availableTopics.filter(topic => preferences.selectedTopics.includes(topic.id));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          <Settings size={32} style={{ verticalAlign: 'middle', marginRight: 16 }} />
          Personalize Your Daily Brief
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose your topics and customize how you receive your news summaries
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully! Your next brief will reflect these changes.
        </Alert>
      )}

      {/* Topic Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Choose Your Topics ({preferences.selectedTopics.length} selected)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the topics you're most interested in. You can choose as many as you like.
          </Typography>

          {/* Use Box with CSS Grid instead of MUI Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 2,
              mb: 3
            }}
          >
            {availableTopics.map((topic) => {
              const isSelected = preferences.selectedTopics.includes(topic.id);
              return (
                <Card
                  key={topic.id}
                  sx={{
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${topic.color}` : '2px solid transparent',
                    bgcolor: isSelected ? `${topic.color}10` : 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => toggleTopic(topic.id)}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {topic.icon}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {topic.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {topic.description}
                    </Typography>
                    {isSelected && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<Check size={16} />}
                          label="Selected"
                          size="small"
                          sx={{ 
                            bgcolor: topic.color, 
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white' }
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Selected Topics Summary */}
          {preferences.selectedTopics.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Your Selected Topics:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getSelectedTopicsData().map((topic) => (
                  <Chip
                    key={topic.id}
                    label={topic.name}
                    onDelete={() => toggleTopic(topic.id)}
                    sx={{ bgcolor: `${topic.color}20`, color: topic.color }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delivery Preferences */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Delivery Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Customize when and how often you receive your personalized briefs
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 3
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={preferences.frequency}
                label="Frequency"
                onChange={(e) => updatePreference('frequency', e.target.value as any)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Preferred Time</InputLabel>
              <Select
                value={preferences.preferredTime}
                label="Preferred Time"
                onChange={(e) => updatePreference('preferredTime', e.target.value)}
              >
                <MenuItem value="06:00">6:00 AM</MenuItem>
                <MenuItem value="07:00">7:00 AM</MenuItem>
                <MenuItem value="08:00">8:00 AM</MenuItem>
                <MenuItem value="09:00">9:00 AM</MenuItem>
                <MenuItem value="12:00">12:00 PM</MenuItem>
                <MenuItem value="18:00">6:00 PM</MenuItem>
                <MenuItem value="20:00">8:00 PM</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Writing Tone</InputLabel>
            <Select
              value={preferences.tone}
              label="Writing Tone"
              onChange={(e) => updatePreference('tone', e.target.value as any)}
            >
              <MenuItem value="casual">
                <Box>
                  <Typography variant="body2" fontWeight="bold">Casual</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Friendly and conversational tone
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="professional">
                <Box>
                  <Typography variant="body2" fontWeight="bold">Professional</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Formal and business-appropriate
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="technical">
                <Box>
                  <Typography variant="body2" fontWeight="bold">Technical</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Detailed with technical insights
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Notification Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose how you want to receive your daily briefs
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(e) => updatePreference('emailNotifications', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold">Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive your daily brief via email
                  </Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={savePreferences}
          disabled={!hasChanges}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '50px',
            bgcolor: hasChanges ? 'primary.main' : 'grey.300',
            '&:hover': {
              bgcolor: hasChanges ? 'primary.dark' : 'grey.400'
            }
          }}
        >
          {hasChanges ? 'Save Preferences' : 'All Changes Saved'}
        </Button>
        {hasChanges && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            You have unsaved changes
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TopicSelector;

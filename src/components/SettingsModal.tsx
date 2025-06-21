import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import { X } from 'lucide-react';
import TopicSelector from './TopicSelector';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // Add user prop type
}

const SettingsModal = ({ open, onClose, user }: SettingsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success'
  });
  const [notifications, setNotifications] = useState(true);
  const [topics, setTopics] = useState(user.interests || []);
  const [newTopic, setNewTopic] = useState('');

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      // Create a notification for the request
      setNotification({
        open: true,
        message: 'Sending test email request...',
        type: 'success'
      });
      
      const response = await fetch('/.netlify/functions/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'anselmelvis62@gmail.com' // Change to your email
        })
      });
      
      // Log the raw response
      console.log('Raw response status:', response.status);
      
      // Get response text first (safer than direct json)
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Try to parse as JSON if possible
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed result:', result);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
      }
      
      // Show the result or error
      setNotification({
        open: true,
        message: result?.success ? 
          'Test email sent! Check your inbox.' : 
          `Failed: ${result?.message || response.statusText}`,
        type: result?.success ? 'success' : 'error'
      });
    } catch (error) {
      console.error('Network error:', error);
      setNotification({
        open: true,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t: string) => t !== topic));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
            margin: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Settings & Preferences
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'grey.500',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <X size={24} />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <TopicSelector />
            
            {/* Notification Settings */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Email Delivery
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                  }
                  label="Enable Email Notifications"
                />
              </FormGroup>
              <Button 
                variant="contained"
                color="primary"
                onClick={sendTestEmail}
                disabled={loading}
                startIcon={<span>📧</span>}
                sx={{ mt: 1 }}
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Sends a test digest to your email to verify the delivery system.
              </Typography>
            </Box>
            
            {/* Topics/Interests Settings */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Your Topics/Interests
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                {topics.map((topic: string) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleRemoveTopic(topic)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Add Topic"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  size="small"
                />
                <Button variant="contained" onClick={handleAddTopic}>
                  Add
                </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsModal;
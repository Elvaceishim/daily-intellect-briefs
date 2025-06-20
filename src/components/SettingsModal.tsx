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
  Alert
} from '@mui/material';
import { X } from 'lucide-react';
import TopicSelector from './TopicSelector';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
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

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      // Check if running locally
      const isLocal = window.location.hostname === 'localhost';
      
      // If local, use a mock response
      if (isLocal) {
        console.log("Running in dev mode - mocking function response");
        
        // Wait 1 second to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock success response
        setNotification({
          open: true,
          message: 'DEV MODE: Email would be sent in production',
          type: 'success'
        });
        
        setLoading(false);
        return;
      }
      
      // Regular production code for Netlify environment
      const response = await fetch('/.netlify/functions/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'your-email@example.com' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      setNotification({
        open: true,
        message: result.success ? 
          'Test email sent! Check your inbox.' : 
          `Failed to send test email: ${result.message}`,
        type: result.success ? 'success' : 'error'
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      setNotification({
        open: true,
        message: `Error sending test email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
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
            
            {/* Test Email Button */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Email Delivery
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                onClick={sendTestEmail}
                disabled={loading}
                startIcon={<span>📧</span>}
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Sends a test digest to your email to verify the delivery system.
              </Typography>
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
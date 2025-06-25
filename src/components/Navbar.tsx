import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Sparkles, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import NextBriefCountdown from './NextBriefCountdown';

const Navbar = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Sparkles color="#e75480" size={32} />
          <Typography variant="h6" fontWeight={700} color="#e75480">Daily Briefs</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <NextBriefCountdown targetTime="08:00" />
          <Button
            variant="contained"
            startIcon={<Settings size={18} />}
            sx={{
              borderRadius: 999,
              background: 'linear-gradient(90deg, #e75480, #a890fe)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: 3,
              px: 3,
              py: 1.2,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #a890fe, #e75480)',
                boxShadow: 6,
              },
            }}
            onClick={() => setShowSettings(true)}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 999,
              background: 'linear-gradient(90deg, #e75480, #a890fe)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: 3,
              px: 3,
              py: 1.2,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #a890fe, #e75480)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </AppBar>
  );
};

export default Navbar;
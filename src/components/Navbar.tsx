import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Sparkles, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import NextBriefCountdown from './NextBriefCountdown';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Only show settings/countdown if user is logged in and on /briefs
  const showBriefsExtras = user && location.pathname.startsWith('/briefs');

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
      <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Sparkles color="#e75480" size={32} />
          {/* Removed the "Daily Briefs" Typography */}
        </Box>
        <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
          {showBriefsExtras && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <NextBriefCountdown targetTime="08:00" />
              <Button
                variant="contained"
                startIcon={<Settings size={18} />}
                sx={{ borderRadius: 999, fontWeight: 600 }}
                onClick={() => setShowSettings(true)}
              >
                Settings
              </Button>
            </Box>
          )}
          {!user && location.pathname !== '/login' && (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 999, fontWeight: 600 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </AppBar>
  );
};

export default Navbar;
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { getUserBrief } from '../services/briefService';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Stack,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BriefCard from '../components/BriefCard';
import ProfileSection from '../components/ProfileSection';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '../components/SettingsModal';

const drawerWidth = 240;

const mockUser = {
  id: 1,
  name: 'Jane Doe',
  avatar: '',
  email: 'jane@example.com',
  interests: ['AI', 'Finance', 'Health'],
};

const mockBriefs = [
  {
    id: 1,
    title: 'AI Revolutionizes Healthcare',
    date: '2025-06-21',
    summaries: {
      gist: 'AI is transforming healthcare with faster diagnoses.',
      brainy:
        'Artificial Intelligence is rapidly transforming the healthcare sector by enabling faster and more accurate diagnoses, improving patient outcomes, and reducing costs. Hospitals are integrating AI-powered tools for imaging, patient monitoring, and administrative tasks. Experts believe this trend will accelerate as technology matures and regulatory frameworks adapt.',
    },
    url: '#',
    publishedAt: '2025-06-21T09:00:00Z',
  },
];

// Temporary mock fetchBriefs function for demonstration
async function fetchBriefs() {
  // Simulate API delay
  return new Promise((resolve) => setTimeout(() => resolve(mockBriefs), 500));
}

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [section, setSection] = useState<'briefs' | 'profile'>('briefs');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBriefs()
      .then((data) => setBriefs(data as any[]))
      .catch(() => {
        /* handle error */
      });
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('signedUp');
    navigate('/');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={mockUser.avatar}>{mockUser.name[0]}</Avatar>
          <Typography variant="h6">{mockUser.name}</Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={section === 'briefs'} onClick={() => setSection('briefs')}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Briefs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={section === 'profile'} onClick={() => setSection('profile')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSettingsOpen(true)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255,255,255,0.95)',
          color: '#3b0764',
          boxShadow: '0 2px 12px #a21caf22',
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 700 }}>
            Daily Intellect Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="md">
          {section === 'briefs' && (
            <>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome back, {mockUser.name.split(' ')[0]}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Your personalized news briefs based on your interests:{" "}
                <b>{mockUser.interests.join(', ')}</b>
              </Typography>
              <Stack spacing={3}>
                {briefs.map((brief) => (
                  <BriefCard key={brief.id} brief={brief} />
                ))}
              </Stack>
            </>
          )}
          {section === 'profile' && <ProfileSection user={mockUser} />}
        </Container>
      </Box>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={mockUser}
      />
    </Box>
  );
}
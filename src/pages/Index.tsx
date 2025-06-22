import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Container, 
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Mail, 
  Clock, 
  TrendingUp, 
  Cpu, 
  Settings, 
  Briefcase, 
  Calendar, 
  Newspaper 
} from "lucide-react";
import { usePreferences } from '../hooks/usePreferences';
import SettingsModal from '../components/SettingsModal';
import NextBriefCountdown from '../components/NextBriefCountdown';
import BriefCard from '../components/BriefCard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { preferences, isLoading } = usePreferences();

  const handleSettingsClick = () => {
    console.log('Settings clicked!');
    setShowSettings(true);
    console.log('showSettings set to:', true);
  };

  const handleCloseSettings = () => {
    console.log('Closing settings modal');
    setShowSettings(false);
  };

  // Add debug log
  console.log('Current showSettings state:', showSettings);

  // Mock data
  const mockBriefs = [
    {
      title: "AI Revolutionizes Healthcare",
      summary: "Major AI breakthroughs in healthcare...",
      date: "2025-06-15",
      topics: ["tech", "ai"],
      readTime: "3 min",
      headlines: 5
    },
    {
      title: "Crypto Market Update",
      summary: "Bitcoin hits new highs as market stabilizes...",
      date: "2025-06-14",
      topics: ["crypto", "finance"],
      readTime: "4 min",
      headlines: 7
    },
    {
      title: "Climate Change Summit Highlights",
      summary: "World leaders gather to discuss climate action...",
      date: "2025-06-13",
      topics: ["environment", "politics"],
      readTime: "5 min",
      headlines: 6
    },
  ];

  const stats = [
    { label: 'Briefs Delivered', value: '47', icon: Mail },
    { label: 'Topics Tracked', value: isLoading ? '...' : preferences.selectedTopics.length.toString(), icon: TrendingUp },
    { label: 'Average Read Time', value: '3.2 min', icon: Clock },
    { label: 'This Week', value: '7 briefs', icon: Calendar }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Curation',
      description: 'AI selects the most important stories from thousands of sources',
      color: '#2563eb'
    },
    {
      icon: Cpu,
      title: 'AI Summaries',
      description: 'Get concise, intelligent summaries of complex news stories',
      color: '#10b981'
    },
    {
      icon: Settings,
      title: 'Personalized',
      description: 'Choose your topics and delivery preferences',
      color: '#8b5cf6'
    },
    {
      icon: Mail,
      title: 'Daily Delivery',
      description: 'Receive your brief via email or WhatsApp',
      color: '#ef4444'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <div className="content-overlay">
          <Container maxWidth="xl">
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="90vh"
              textAlign="center"
              py={6}
            >
              {/* Hero Section */}
              <Box className="section">
                <Stack spacing={3} alignItems="center" maxWidth="800px">
                  <Chip 
                    icon={<Cpu size={16} />}
                    label="AI-Powered News Summarization"
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      px: 2, 
                      py: 0.5,
                      '& .MuiChip-label': { fontSize: '0.875rem' }
                    }}
                  />
                  
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 700,
                      lineHeight: 1.1,
                      maxWidth: '700px'
                    }}
                  >
                    Your Personal Daily Brief Generator
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '1.25rem',
                      lineHeight: 1.6,
                      maxWidth: '600px',
                      fontWeight: 400
                    }}
                  >
                    Get AI-summarized news from your favorite topics delivered to your inbox every morning. 
                    Stay informed without the information overload.
                  </Typography>
                </Stack>
              </Box>

              {/* Features Grid */}
              <Box className="section" width="100%">
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    justifyContent: 'center'
                  }}
                >
                  {features.map((feature, index) => (
                    <Card 
                      key={index}
                      sx={{ 
                        height: '100%',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box mb={2}>
                          <feature.icon size={40} style={{ color: feature.color }} />
                        </Box>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* CTA Section */}
              <Box className="section">
                <Stack spacing={2} alignItems="center">
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => setIsAuthenticated(true)}
                    sx={{ 
                      px: 6, 
                      py: 2, 
                      fontSize: '1.125rem',
                      borderRadius: '50px',
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Get Started - It's Free
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    No credit card required • 7-day free trial
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Container>
        </div>
      </div>
    );
  }

  const briefs = mockBriefs; // or fetched data

  return (
    <div className="min-h-screen">
      <div className="content-overlay">
        <AppBar 
          position="sticky" 
          color="transparent" 
          elevation={0} 
          sx={{ 
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            mb: 4
          }}
        >
          <Toolbar sx={{ py: 1.5 }}>
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <Briefcase size={24} />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div" fontWeight={700}>
                  Daily Brief
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AI-Powered News
                </Typography>
              </Box>
            </Box>
            
            <Box 
              display="flex" 
              alignItems="center" 
              gap={3}
              sx={{ flexShrink: 0 }}
            >
              {/* Add this debug log */}
              {console.log('About to render NextBriefCountdown with preferences:', preferences)}
              
              <NextBriefCountdown targetTime={preferences.preferredTime || '08:00'} />
              
              <Button 
                variant="outlined" 
                startIcon={<Settings size={16} />}
                size="small"
                sx={{ 
                  borderRadius: '50px',
                  flexShrink: 0,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap'
                }}
                onClick={handleSettingsClick}
              >
                Settings
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Test Modal */}
        <SettingsModal 
          open={showSettings} 
          onClose={handleCloseSettings} 
        />

        <Container maxWidth="xl">
          <Box className="section" sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 3
              }}
            >
              {stats.map((stat, index) => (
                <Card key={index} sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box mb={1}>
                      <stat.icon size={32} style={{ color: '#6b7280' }} />
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <Box className="section">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                  Recent Briefs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your personalized daily news summaries
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<Calendar size={16} />}
                sx={{ borderRadius: '50px' }}
              >
                View All
              </Button>
            </Box>

            <Stack spacing={3}>
              {briefs.map((brief) => (
                <BriefCard brief={brief} />
              ))}
            </Stack>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Index;

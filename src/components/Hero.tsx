import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
      sx={{
        background: 'transparent',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating gradient blobs */}
      <Box sx={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'linear-gradient(135deg, #e75480 0%, #a890fe 100%)',
        opacity: 0.15, top: -60, left: -60, zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute', width: 150, height: 150, borderRadius: '50%',
        background: 'linear-gradient(135deg, #fff9e5 0%, #ffe6e6 100%)',
        opacity: 0.12, bottom: -40, right: -40, zIndex: 0
      }} />

      <Typography
        variant="h2"
        fontWeight={800}
        sx={{
          background: 'linear-gradient(90deg, #e75480, #a890fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          zIndex: 1,
        }}
      >
        Your <span style={{ color: '#e75480' }}>AI-Powered</span> Daily Briefs
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4, zIndex: 1 }}>
        Stay ahead with concise, personalized news summaries delivered to you.
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          borderRadius: 999,
          background: 'linear-gradient(90deg, #e75480, #a890fe)',
          color: '#fff',
          fontWeight: 700,
          px: 6,
          py: 2,
          boxShadow: 4,
          zIndex: 1,
          fontSize: '1.25rem',
        }}
        onClick={() => navigate('/login')}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Hero;
import { Box, Button, Container, TextField, Typography, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('signedUp', 'yes');
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Free Account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Sign up to start receiving your personalized daily briefs.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" size="large">
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
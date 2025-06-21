import { useEffect, useState } from 'react';
import { Container, Typography, Stack, CircularProgress, Alert, Box } from '@mui/material';
import BriefCard from '../components/BriefCard';

export default function AllBriefs() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBriefs() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
        const response = await fetch(`${apiUrl}/top-headlines?token=${apiKey}&lang=en&max=10`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setBriefs(data.articles || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchBriefs();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
        py: 0,
      }}
    >
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#3b0764',
            letterSpacing: 1,
            mb: 4,
            textShadow: '0 2px 8px #fff8',
            textTransform: 'uppercase',
          }}
        >
          BRIEFS
        </Typography>
        {loading && (
          <Stack alignItems="center" sx={{ my: 8 }}>
            <CircularProgress />
          </Stack>
        )}
        {error && (
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={4}>
          {briefs.map((brief, idx) => (
            <BriefCard key={brief.id || brief.url || idx} brief={brief} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
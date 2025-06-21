import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RecentBriefs from '../components/RecentBriefs';

// Example data; replace with your real data fetching logic
const recentBriefs = [
  {
    id: 1,
    title: "AI Revolutionizes Healthcare",
    date: "2025-06-21",
    summaries: {
      gist: "AI is transforming healthcare with faster diagnoses.",
      brainy: "Artificial Intelligence is rapidly transforming the healthcare sector by enabling faster and more accurate diagnoses, improving patient outcomes, and reducing costs. Hospitals are integrating AI-powered tools for imaging, patient monitoring, and administrative tasks. Experts believe this trend will accelerate as technology matures and regulatory frameworks adapt."
    },
    headlines: ["AI in Hospitals", "Faster Diagnoses", "Healthcare Innovation"],
    readTime: "3 min",
    summary: "AI is making healthcare more efficient and accurate.",
    newsItems: [
      { source: "Health News", url: "https://example.com/ai-healthcare" }
    ],
    topics: ["AI", "Healthcare", "Technology"]
  },
  // ...more briefs
];

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Your Personal Daily Brief Generator
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Stay informed with concise, AI-powered news summaries tailored to your interests.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/all-briefs"
          >
            View Recent Briefs
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/signup"
          >
            Get Started – It&apos;s Free
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
          Powered by OpenAI &amp; the latest news APIs.
        </Typography>
      </Box>
    </Container>
  );
}
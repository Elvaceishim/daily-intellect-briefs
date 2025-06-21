import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// Import your AI summary service
import { getSummariesForTopic } from '../services/aiSummaryService';

export default function BriefCard({ brief }: { brief: any }) {
  const [mode, setMode] = useState<'gist' | 'brainy'>('gist');
  const [summaries, setSummaries] = useState(brief.summaries ?? { gist: '', brainy: '' });
  const [loading, setLoading] = useState(false);

  // Fetch AI summaries if missing when toggling
  const handleModeChange = async (newMode: 'gist' | 'brainy') => {
    setMode(newMode);
    if (!summaries.gist || !summaries.brainy) {
      setLoading(true);
      try {
        const aiSummaries = await getSummariesForTopic(brief.content || brief.title);
        setSummaries(aiSummaries);
      } catch (e) {
        // Optionally handle error
      }
      setLoading(false);
    }
  };

  const appUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const briefUrl = `${appUrl}/share/${brief.id}`;

  const handleShareX = () => {
    const text = `${brief.title}\n${mode === 'gist' ? summaries.gist : summaries.brainy}\n${briefUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      briefUrl
    )}&title=${encodeURIComponent(brief.title)}&summary=${encodeURIComponent(
      mode === 'gist' ? summaries.gist : summaries.brainy
    )}`;
    window.open(url, '_blank');
  };

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: 'rgba(255,255,255,0.97)',
        boxShadow: '0 4px 24px 0 #a21caf22',
        mb: 2,
        overflow: 'visible',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight={600} color="primary.dark" gutterBottom>
          {brief.title}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant={mode === 'gist' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => handleModeChange('gist')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            ⚡ Just the Gist
          </Button>
          <Button
            variant={mode === 'brainy' ? 'contained' : 'outlined'}
            color="secondary"
            size="small"
            onClick={() => handleModeChange('brainy')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            🧠 More Brainy
          </Button>
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ my: 2 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', minHeight: 60 }}>
            {mode === 'gist'
              ? summaries.gist || <em>No summary available.</em>
              : summaries.brainy || <em>No summary available.</em>}
          </Typography>
        )}
        <Box sx={{ fontSize: 13, color: '#a21caf', mt: 2 }}>
          {brief.publishedAt
            ? new Date(brief.publishedAt).toLocaleString()
            : brief.date}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          href={brief.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Read Full Brief
        </Button>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Save">
            <IconButton color="secondary">
              <BookmarkBorderIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on X">
            <IconButton color="primary" onClick={handleShareX}>
              <TwitterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on LinkedIn">
            <IconButton color="primary" onClick={handleShareLinkedIn}>
              <LinkedInIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}
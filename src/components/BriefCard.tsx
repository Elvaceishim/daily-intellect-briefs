import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button } from '@mui/material';

export interface Brief {
  title: string;
  summary: string;
  date: string;
  topics: string[];
  readTime: string;
  headlines: number;
}

interface BriefCardProps {
  brief: Brief;
}

const BriefCard: React.FC<BriefCardProps> = ({ brief }) => {
  const [news, setNews] = useState<{ title: string; description: string; url: string } | null>(null);

  const handleClick = async () => {
    console.log('Card clicked:', brief.title); // Should never be undefined
    try {
      const response = await fetch(
        `/.netlify/functions/news?query=${encodeURIComponent(brief.title)}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNews(data.articles?.[0] || null);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
        borderLeft: '4px solid #2563eb',
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {brief.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {brief.summary}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          {brief.topics.map((topic) => (
            <Chip key={topic} label={topic} color="primary" variant="outlined" size="small" />
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {brief.date} • {brief.readTime} • {brief.headlines} headlines
        </Typography>
        {news && (
          <div style={{ marginTop: 16, background: '#f9f9f9', padding: 8 }}>
            <Typography variant="subtitle2">{news.title}</Typography>
            <Typography variant="body2">{news.description}</Typography>
            <Button
              size="small"
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 1 }}
            >
              Read more
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefCard;

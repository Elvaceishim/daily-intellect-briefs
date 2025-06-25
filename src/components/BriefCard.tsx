import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button, Box } from '@mui/material';

const BriefCard = ({ brief }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card
      onClick={() => setOpen((o) => !o)}
      sx={{
        cursor: 'pointer',
        mb: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
        borderLeft: '4px solid #2563eb',
      }}
    >
      <CardContent>
        {brief.image && (
          <Box
            sx={{
              width: '100%',
              height: 180,
              overflow: 'hidden',
              borderRadius: 2,
              mb: 2,
              background: '#f3f3f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={brief.image}
              alt={brief.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {brief.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {brief.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          {Array.isArray(brief.topics) && brief.topics.map((topic) => (
            <Chip key={topic} label={topic} color="primary" variant="outlined" size="small" />
          ))}
          {brief.category && (
            <Chip label={brief.category} color="primary" variant="outlined" size="small" />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {brief.date?.split('T')[0]} • {brief.readTime} • {brief.headlines} headline{brief.headlines > 1 ? 's' : ''}
        </Typography>
        {open && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {
                brief.aiSummary && brief.aiSummary !== brief.summary
                  ? brief.aiSummary
                  : (brief.fullSummary || brief.summary || brief.description)
              }
            </Typography>
            {brief.url && (
              <Button
                size="small"
                href={brief.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
              >
                Read More
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefCard;
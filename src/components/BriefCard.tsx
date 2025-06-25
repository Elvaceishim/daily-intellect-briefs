import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button, Box } from '@mui/material';

const BriefCard = ({ brief }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card
      onClick={() => setOpen((o) => !o)}
      sx={{
        width: '100%',
        maxWidth: { xs: '100vw', sm: 400, md: 420 },
        minHeight: 320,
        mx: 'auto',
        mb: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        boxShadow: 3,
        background: 'rgba(255,255,255,0.98)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxSizing: 'border-box',
      }}
    >
      <CardContent>
        {brief.image && (
          <Box
            sx={{
              width: '100%',
              height: { xs: 160, sm: 180, md: 200 },
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
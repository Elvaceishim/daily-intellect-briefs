import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button } from '@mui/material';

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
        <Typography variant="h6" gutterBottom>
          {brief.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {brief.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          {brief.topics?.map((topic) => (
            <Chip key={topic} label={topic} color="primary" variant="outlined" size="small" />
          ))}
          {brief.category && (
            <Chip label={brief.category} color="primary" variant="outlined" size="small" />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {brief.date} • {brief.readTime} • {brief.headlines} headlines
        </Typography>
        {open && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {brief.fullSummary || brief.summary}
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

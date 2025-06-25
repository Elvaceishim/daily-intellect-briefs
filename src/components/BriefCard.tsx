import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const BriefCard = ({ brief }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => setExpanded(true);
  const handleCollapse = () => setExpanded(false);

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: { xs: '100vw', sm: 400, md: 420 },
        minHeight: 220,
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
        position: 'relative',
      }}
    >
      {brief.image && (
        <Box
          sx={{
            width: '100%',
            height: 140,
            overflow: 'hidden',
            borderRadius: 2,
            mb: 1,
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
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>
        {brief.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#374151',
          mb: 1,
          maxHeight: expanded ? 'none' : 48,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          transition: 'max-height 0.2s',
        }}
      >
        {brief.summary || brief.description || 'No summary available.'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
        {!expanded ? (
          <Button size="small" onClick={handleExpand} sx={{ color: '#2563eb', fontWeight: 600 }}>
            Open
          </Button>
        ) : (
          <Button size="small" onClick={handleCollapse} sx={{ color: '#6b7280', fontWeight: 600 }}>
            Close
          </Button>
        )}
        <Button
          size="small"
          href={brief.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#2563eb', fontWeight: 600, ml: 'auto' }}
        >
          Read More
        </Button>
      </Box>
      <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
        {brief.source?.name} &middot; {new Date(brief.published_at || brief.date).toLocaleDateString()}
      </Typography>
    </Card>
  );
};

export default BriefCard;
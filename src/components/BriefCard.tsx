import React, { useState } from 'react';
import { Card, Typography, Button, Box } from '@mui/material';

function getReadTime(text: string) {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

function getValidDate(brief: any) {
  const rawDate = brief.published_at || brief.date || brief.created_at;
  if (!rawDate) return null;
  const dateObj = new Date(rawDate);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

const BriefCard = ({ brief }) => {
  const [expanded, setExpanded] = useState(false);

  const dateObj = getValidDate(brief);
  const dateStr = dateObj
    ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const readTime = getReadTime(brief.content || brief.summary || brief.description || '');

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 370,
        minHeight: 180,
        mx: 'auto',
        mb: 2,
        p: 0,
        borderRadius: 3,
        boxShadow: 2,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: '100%',
          height: 120,
          background: '#e0e7ef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={brief.image || '/placeholder.png'}
          alt={brief.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={e => (e.currentTarget.src = '/placeholder.png')}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: '#2563eb',
            mb: 0.5,
            fontSize: 17,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={brief.title}
        >
          {brief.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#374151',
            mb: 1,
            fontSize: 15,
            maxHeight: expanded ? 200 : 48,
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
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto' }}>
          {!expanded ? (
            <Button size="small" onClick={() => setExpanded(true)} sx={{ color: '#2563eb', fontWeight: 600 }}>
              Open
            </Button>
          ) : (
            <Button size="small" onClick={() => setExpanded(false)} sx={{ color: '#6b7280', fontWeight: 600 }}>
              Close
            </Button>
          )}
          <Button
            size="small"
            href={brief.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#fff',
              background: '#2563eb',
              fontWeight: 700,
              borderRadius: 999,
              px: 2,
              ml: 'auto',
              textTransform: 'none',
              '&:hover': { background: '#1e40af' },
            }}
          >
            Read More
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {dateStr && (
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              {dateStr}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: '#6b7280', ml: dateStr ? 2 : 0 }}>
            {readTime} min read
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#6b7280', mt: 0.5 }}>
          {brief.source?.name || ''}
        </Typography>
      </Box>
    </Card>
  );
};

export default BriefCard;
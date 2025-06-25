import React, { useEffect, useState } from 'react';
import BriefCard from '../components/BriefCard';
import { Box, Card, CardContent, Typography, Button, Stack, Paper } from '@mui/material';
import { Mail, TrendingUp, Clock, Calendar } from 'lucide-react';
import { getAISummary } from '../utils/getAISummary';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const BriefsPage = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTopics, setSelectedTopics] = useState([]);

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:1023px)');
  const isLaptop = useMediaQuery('(min-width:1024px)');

  useEffect(() => {
    const fetchBriefs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/news?limit=10');
        const data = await response.json();
        let briefs = Array.isArray(data.data) ? data.data : [];

        // Summarize each brief if summary is missing
        briefs = await Promise.all(
          briefs.map(async (brief) => {
            if (!brief.summary && brief.content) {
              const summary = await getAISummary(brief.content);
              return { ...brief, summary };
            }
            return brief;
          })
        );

        setBriefs(briefs);
      } catch (error) {
        setBriefs([]);
      }
      setLoading(false);
    };

    fetchBriefs();
  }, []);

  useEffect(() => {
    // Load topics from userPreferences.selectedTopics
    const loadTopics = () => {
      try {
        const userPrefsStored = localStorage.getItem('userPreferences');
        if (userPrefsStored) {
          const userPrefs = JSON.parse(userPrefsStored);
          const topics = userPrefs.selectedTopics || [];
          setSelectedTopics(Array.isArray(topics) ? topics : []);
        } else {
          setSelectedTopics([]);
        }
      } catch (error) {
        setSelectedTopics([]);
      }
    };

    loadTopics();

    const handleStorageChange = (e) => {
      if (e.key === 'userPreferences') {
        loadTopics();
      }
    };

    const handleUserPrefsUpdate = () => {
      loadTopics();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userPreferencesUpdated', handleUserPrefsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userPreferencesUpdated', handleUserPrefsUpdate);
    };
  }, []);

  const briefsDelivered = briefs.length;
  const topicsTracked = selectedTopics.length;
  const averageReadTime = briefs.length
    ? (briefs.reduce((sum, b) => sum + (parseFloat(b.readTime) || 0), 0) / briefs.length).toFixed(1) + ' min'
    : '0.0 min';
  const briefsThisWeek = briefs.filter(b => {
    const date = new Date(b.date || b.published_at);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length + ' briefs';

  const stats = [
    { label: 'Briefs Delivered', value: briefsDelivered, icon: Mail },
    { label: 'Topics Tracked', value: topicsTracked, icon: TrendingUp },
    { label: 'Average Read Time', value: averageReadTime, icon: Clock },
    { label: 'This Week', value: briefsThisWeek, icon: Calendar }
  ];

  // Use 'General' if category is missing
  const categories = [
    'All',
    ...Array.from(new Set(briefs.map(b => b.category || 'General')))
  ];

  const filteredBriefs = selectedCategory === 'All'
    ? briefs
    : briefs.filter(b => (b.category || 'General') === selectedCategory);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        maxWidth: isLaptop ? 1200 : isTablet ? 900 : '100vw',
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, sm: 4 },
        boxSizing: 'border-box',
      }}
    >
      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: { xs: 2, md: 3 },
          mb: 4,
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {stats.map((stat, idx) => (
          <Paper
            key={stat.label}
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#fff',
              boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)',
              minHeight: 120,
              gap: 1,
            }}
          >
            <Box sx={{ mb: 1, color: '#2563eb' }}>{React.createElement(stat.icon, { size: 28 })}</Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#2563eb',
                fontSize: { xs: 22, md: 26 },
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                fontWeight: 500,
                fontSize: { xs: 14, md: 16 },
                textAlign: 'center',
              }}
            >
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Filter by Category
        </Typography>
        {isMobile ? (
          <Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            size="small"
            sx={{ mb: 3, width: '100%', maxWidth: 320, background: '#fff' }}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: selectedCategory === category ? 700 : 500,
                  color: selectedCategory === category ? '#fff' : '#2563eb',
                  background: selectedCategory === category ? '#2563eb' : '#fff',
                  borderColor: '#2563eb',
                  minWidth: 100,
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      <h2>Your Daily Briefs</h2>
      {loading && <div>Loading briefs...</div>}
      {!loading && briefs.length === 0 && <div>No briefs found.</div>}
      {!loading && filteredBriefs.length === 0 && <div>No briefs found.</div>}
      {!loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {filteredBriefs.map((brief, idx) => (
            <Paper
              key={idx}
              elevation={2}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'flex-start' },
                p: 2,
                borderRadius: 3,
                minHeight: 180,
                gap: 2,
                background: '#f8fafc',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: 120 },
                  height: 100,
                  minWidth: 100,
                  background: '#e0e7ef',
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 2, md: 0 },
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
                />
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2563eb', mb: 1, fontSize: 18, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {brief.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#374151', mb: 1, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {brief.summary || brief.description}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  {brief.source?.name} &middot; {new Date(brief.published_at || brief.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BriefsPage;
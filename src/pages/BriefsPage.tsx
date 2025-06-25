import React, { useEffect, useState } from 'react';
import BriefCard from '../components/BriefCard';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { Mail, TrendingUp, Clock, Calendar } from 'lucide-react';
import { getAISummary } from '../utils/getAISummary';

const BriefsPage = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        console.log('Fetching news from: /.netlify/functions/news?limit=10');
        const response = await fetch('/.netlify/functions/news?limit=10');
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const text = await response.text();
          console.error('Response error text:', text);
          throw new Error(text);
        }
        
        const data = await response.json();
        setBriefs(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch briefs:', error);
        console.error('Error details:', error.message);
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
        console.error('Error parsing userPreferences from localStorage:', error);
        setSelectedTopics([]);
      }
    };

    // Load topics initially
    loadTopics();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userPreferences') {
        loadTopics();
      }
    };

    // Listen for custom events from same tab/component updates
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

  // Debug: Log when selectedTopics changes
  useEffect(() => {
    console.log('selectedTopics state updated:', selectedTopics);
  }, [selectedTopics]);

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

  // Debug function to manually test localStorage
  const testLocalStorage = () => {
    // Update the userPreferences object
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    userPrefs.selectedTopics = ['technology', 'business', 'science'];
    localStorage.setItem('userPreferences', JSON.stringify(userPrefs));
    console.log('Test topics saved to userPreferences');
    
    // Force re-read
    setSelectedTopics(userPrefs.selectedTopics);
    console.log('Topics loaded:', userPrefs.selectedTopics);
  };

  return (
    <div>


      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              textAlign: 'center',
              borderRadius: 4,
              boxShadow: 3,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box mb={1}>
                <stat.icon size={32} style={{ color: '#6b7280' }} />
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Filter by Category
        </Typography>
        <Box display="flex" gap={2} mb={3}>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(category)}
              sx={{ borderRadius: 999, textTransform: 'none' }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      <h2>Your Daily Briefs</h2>
      {loading && <div>Loading briefs...</div>}
      {!loading && briefs.length === 0 && <div>No briefs found.</div>}
      {!loading && filteredBriefs.length === 0 && <div>No briefs found.</div>}
      {!loading && filteredBriefs.map((brief, idx) => (
        <BriefCard key={idx} brief={brief} />
      ))}
    </div>
  );
};

export default BriefsPage;
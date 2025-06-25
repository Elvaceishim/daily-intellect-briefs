import { Card, CardContent, Typography, Box } from '@mui/material';
import { Sparkles, ShieldCheck, Zap, Mail } from 'lucide-react';

const features = [
  { icon: <Sparkles color="#a890fe" />, title: "AI Summaries", desc: "Smart, concise news powered by AI." },
  { icon: <ShieldCheck color="#e75480" />, title: "Privacy First", desc: "Your data is always secure." },
  { icon: <Zap color="#ffe6e6" />, title: "Instant Delivery", desc: "Get your brief in seconds." },
  { icon: <Mail color="#f8e1ff" />, title: "Multi-Channel", desc: "Receive via email or dashboard." },
];

const FeaturesGrid = () => (
  <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4} py={8}>
    {features.map((f, i) => (
      <Card
        key={i}
        sx={{
          borderRadius: 4,
          background: 'rgba(255,255,255,0.7)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.18)',
          p: 3,
          minHeight: 180,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box fontSize={40}>{f.icon}</Box>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>{f.title}</Typography>
          <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default FeaturesGrid;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Button as MuiButton, Box, Stack } from '@mui/material';
import { generateTLDR } from '../utils/tldr';
import { createShareableBrief } from '../services/shareService';
import SocialShareButtons from './SocialShareButtons';
import { useState } from 'react';
import SummaryModeToggle from './SummaryModeToggle';

interface NewsItem {
  title: string;
  summaries: {
    gist: string;
    brainy: string;
  };
  // ...other fields
}

interface Brief {
  id: number;
  date: string;
  topics: string[];
  summary: string;
  readTime: string;
  headlines: number;
  newsItems: NewsItem[]; // Change made here
  title: string;
  content: string;
  summaries: {
    gist: string;
    brainy: string;
  };
}

interface BriefCardProps {
  brief: Brief;
}

const getTopicColor = (topic: string) => {
  const colors = {
    tech: 'bg-blue-100 text-blue-700',
    ai: 'bg-purple-100 text-purple-700',
    crypto: 'bg-orange-100 text-orange-700',
    finance: 'bg-green-100 text-green-700'
  };
  return colors[topic as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const getTopicIcon = (topic: string) => {
  const icons = {
    tech: '💻',
    ai: '🤖',
    crypto: '₿',
    finance: '📈'
  };
  return icons[topic as keyof typeof icons] || '📰';
};

export const BriefCard = ({ brief }: BriefCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const tldr = generateTLDR(
    brief.newsItems.map(item => ({
      title: item.title, // Change made here
      summary: "",
      url: "",
      source: "",
      category: "",
      publishedAt: ""
    }))
  );
  const shareableLink = createShareableBrief({ ...brief, id: String(brief.id) });

  const [mode, setMode] = useState<'gist' | 'brainy'>('gist');

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatDate(brief.date)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {brief.readTime}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {brief.headlines} headlines
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {brief.topics.map((topic) => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className={getTopicColor(topic)}
                >
                  <span className="mr-1">{getTopicIcon(topic)}</span>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed text-gray-700">
          {brief.summary}
        </CardDescription>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm">
            Read Full Brief
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500">
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500">
              Save
            </Button>
          </div>
        </div>
      </CardContent>
      <Box>
        <MuiButton
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tldr)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mr: 2 }}
        >
          Tweet this TL;DR
        </MuiButton>
        <MuiButton
          href={shareableLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share Brief
        </MuiButton>
      </Box>
      <SocialShareButtons
        shareUrl={shareableLink}
        title={brief.title}
        summary={brief.summary}
      />
      <div>
        <h3>{brief.title}</h3>
        <SummaryModeToggle mode={mode} setMode={setMode} />
        <div>
          {mode === 'gist' ? brief.summaries.gist : brief.summaries.brainy}
        </div>
      </div>
    </Card>
  );
};

// Example usage: Render BriefCard in a parent component by passing a 'brief' prop.
// <BriefCard brief={someBriefObject} />

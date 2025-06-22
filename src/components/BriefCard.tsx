import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, TrendingUp } from "lucide-react";

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

const BriefCard = ({ brief }: BriefCardProps) => {
  const [news, setNews] = useState<{ title: string; description: string; url: string } | null>(null);

  const handleClick = async () => {
    console.log('Card clicked:', brief.title);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500" 
      onClick={handleClick} 
      style={{ cursor: 'pointer' }}
    >
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
        {news && (
          <div style={{ marginTop: 16, background: '#f9f9f9', padding: 8 }}>
            <h4>{news.title}</h4>
            <p>{news.description}</p>
            <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        )}
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
    </Card>
  );
};

export default BriefCard;

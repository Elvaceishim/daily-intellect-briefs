import { BriefCard } from './BriefCard';

interface Brief {
  id: number;
  title: string;
  date: string;
  summaries: {
    gist: string;
    brainy: string;
  };
  headlines: string[];
  readTime: string;
  summary: string;
  newsItems: any[]; // Replace 'any' with the actual type if available
  topics: string[];
  // ...other fields as needed
}

interface RecentBriefsProps {
  briefs: Brief[];
}

export default function RecentBriefs({ briefs }: RecentBriefsProps) {
  return (
    <div>
      <h2>Recent Briefs</h2>
      {briefs.map(brief => (
        <BriefCard key={brief.id} brief={brief} />
      ))}
    </div>
  );
}
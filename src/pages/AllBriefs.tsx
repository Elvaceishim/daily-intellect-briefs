import { recentBriefs } from '../data/recentBriefs';
import { BriefCard } from '../components/BriefCard';

export default function AllBriefs() {
  return (
    <div>
      <h2>All Briefs</h2>
      {recentBriefs.map(brief => (
        <BriefCard key={brief.id} brief={brief} />
      ))}
    </div>
  );
}
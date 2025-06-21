import { BriefCard } from './BriefCard';

export default function RecentBriefs({ briefs, onViewAll }: { briefs: any[], onViewAll: () => void }) {
  return (
    <div>
      <h2>Recent Briefs</h2>
      <div>
        {briefs.length === 0 ? (
          <p>No briefs available.</p>
        ) : (
          briefs.map(brief => <BriefCard key={brief.id} brief={brief} />)
        )}
      </div>
      <button onClick={onViewAll} style={{ marginTop: 16 }}>
        View All
      </button>
    </div>
  );
}
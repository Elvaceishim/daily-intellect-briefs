import RecentBriefs from '../components/RecentBriefs';
import { recentBriefs } from '../data/recentBriefs';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ...other homepage content... */}
      <RecentBriefs
        briefs={recentBriefs}
        onViewAll={() => navigate('/all-briefs')}
      />
    </div>
  );
}
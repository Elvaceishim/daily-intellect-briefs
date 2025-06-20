// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { getUserBrief } from '../services/briefService';

export default function Dashboard({ userId }) {
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    getUserBrief(userId).then(setBrief);
  }, [userId]);

  if (!brief) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Daily Brief</h2>
      {brief.newsItems.map(item => (
        <div key={item.url}>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
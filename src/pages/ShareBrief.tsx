// src/pages/ShareBrief.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBriefByToken } from '../services/briefService';

export default function ShareBrief() {
  const { token } = useParams();
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    getBriefByToken(token).then(setBrief);
  }, [token]);

  if (!brief) return <div>Loading...</div>;

  return (
    <div>
      <h2>Shared Brief</h2>
      {brief.newsItems.map(item => (
        <div key={item.url}>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
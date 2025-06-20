// src/pages/ShareBrief.tsx
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SocialShareButtons from '../components/SocialShareButtons';
import { getBriefByToken } from '../services/briefService';

export default function ShareBrief() {
  const { token } = useParams();
  const [brief, setBrief] = useState<any>(null);

  useEffect(() => {
    getBriefByToken(token).then(setBrief);
  }, [token]);

  if (!brief) return <div>Loading...</div>;

  const shareUrl = `${window.location.origin}/share/${token}`;

  return (
    <>
      <Helmet>
        <title>{brief.title}</title>
        <meta property="og:title" content={brief.title} />
        <meta property="og:description" content={brief.summary} />
        <meta property="og:url" content={shareUrl} />
        {/* Optionally add an image if available */}
        {/* <meta property="og:image" content={brief.imageUrl} /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <h2>{brief.title}</h2>
      <p>{brief.summary}</p>
      {brief.newsItems.map(item => (
        <div key={item.url}>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
      <SocialShareButtons
        shareUrl={shareUrl}
        title={brief.title}
        summary={brief.summary}
      />
    </>
  );
}
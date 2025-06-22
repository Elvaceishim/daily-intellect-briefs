import { useState } from "react";

const handleClick = async (brief: { title: string }) => {
  const response = await fetch(
    `/.netlify/functions/news?query=${encodeURIComponent(brief.title)}`
  );
  const data = await response.json();
  setNews(data.articles?.[0] || null); // Show the first article or null
};
const [news, setNews] = useState<any>(null);

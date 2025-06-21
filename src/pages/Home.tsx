import RecentBriefs from '../components/RecentBriefs';

// Example data; replace with your real data fetching logic
const recentBriefs = [
  {
    id: 1,
    title: "AI Revolutionizes Healthcare",
    date: "2025-06-21",
    summaries: {
      gist: "AI is transforming healthcare with faster diagnoses.",
      brainy: "Artificial Intelligence is rapidly transforming the healthcare sector by enabling faster and more accurate diagnoses, improving patient outcomes, and reducing costs. Hospitals are integrating AI-powered tools for imaging, patient monitoring, and administrative tasks. Experts believe this trend will accelerate as technology matures and regulatory frameworks adapt."
    },
    headlines: ["AI in Hospitals", "Faster Diagnoses", "Healthcare Innovation"],
    readTime: "3 min",
    summary: "AI is making healthcare more efficient and accurate.",
    newsItems: [
      { source: "Health News", url: "https://example.com/ai-healthcare" }
    ],
    topics: ["AI", "Healthcare", "Technology"]
  },
  // ...more briefs
];

export default function HomePage() {
  return (
    <div>
      {/* ...other homepage content... */}
      <RecentBriefs briefs={recentBriefs} />
    </div>
  );
}
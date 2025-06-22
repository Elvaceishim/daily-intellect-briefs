import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
  Tailwind,
} from '@react-email/components';

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

interface DailyBriefEmailProps {
  userEmail: string;
  userName?: string;
  briefDate: string;
  newsItems: NewsItem[];
  categories: string[];
}

export const DailyBriefTemplate = ({
  userEmail,
  userName = "Friend",
  briefDate,
  newsItems,
  categories
}: DailyBriefEmailProps) => {
  const previewText = `Your daily brief for ${briefDate} - ${newsItems.length} stories from ${categories.join(', ')}`;
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <Heading className="text-2xl font-bold text-gray-900 mb-2">
                📰 Daily Brief
              </Heading>
              <Text className="text-gray-600 text-sm">
                {briefDate} • Curated for {userName}
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                {newsItems.length} stories from: {categories.join(' • ')}
              </Text>
            </Section>

            {/* News Items */}
            {newsItems.map((item, index) => (
              <Section key={index} className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <Text className="text-gray-400 text-xs">
                    {item.source}
                  </Text>
                </div>
                
                <Heading className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                  <Link 
                    href={item.url} 
                    className="text-gray-900 no-underline hover:text-blue-600"
                  >
                    {item.title}
                  </Link>
                </Heading>
                
                <Text className="text-gray-700 text-sm leading-relaxed mb-3">
                  {item.summary}
                </Text>
                
                <Link 
                  href={item.url}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Read full article →
                </Link>
              </Section>
            ))}

            {/* Footer */}
            <Section className="bg-gray-100 rounded-lg p-6 mt-8">
              <Text className="text-gray-600 text-sm text-center mb-4">
                That's your brief for today! 🚀
              </Text>
              
              <Hr className="border-gray-300 my-4" />
              
              <Text className="text-gray-500 text-xs text-center">
                You're receiving this because you subscribed to Daily Brief.
                <br />
                <Link href={`${process.env.SITE_URL}/unsubscribe?email=${userEmail}`} className="text-gray-500 underline">
                  Unsubscribe
                </Link>
                {" • "}
                <Link href={`${process.env.SITE_URL}/settings`} className="text-gray-500 underline">
                  Update Preferences
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DailyBriefTemplate;
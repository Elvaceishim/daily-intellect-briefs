import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

interface DailyDigestEmailProps {
  userEmail: string;
  userName?: string;
  briefDate: string;
  newsItems: NewsItem[];
  categories: string[];
}

export const DailyDigestEmail: React.FC<DailyDigestEmailProps> = ({
  userEmail,
  userName = 'Reader',
  briefDate,
  newsItems = [],
  categories = []
}) => {
  const previewText = `Your daily brief for ${briefDate} - ${newsItems.length} stories`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>📰 Daily Intellect Brief</Heading>
            <Text style={subheading}>{briefDate} • Curated for {userName}</Text>
            <Text style={categoriesStyle}>
              {newsItems.length} stories from: {categories.join(' • ')}
            </Text>
          </Section>

          {/* News Items */}
          {newsItems.map((item, index) => (
            <Section key={index} style={newsItem}>
              <div style={categoryRow}>
                <span style={categoryTag}>{item.category}</span>
                <Text style={sourceText}>{item.source}</Text>
              </div>
              
              <Heading style={newsTitle}>
                <Link href={item.url} style={titleLink}>
                  {item.title}
                </Link>
              </Heading>
              
              <Text style={summary}>
                {item.summary}
              </Text>
              
              <Link style={readMore} href={item.url}>
                Read full article →
              </Link>
            </Section>
          ))}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              That's your brief for today! 🚀
            </Text>
            
            <Hr style={hr} />
            
            <Text style={unsubscribeText}>
              You're receiving this because you subscribed to Daily Intellect Brief.
              <br />
              <Link href={`https://dbg1.netlify.app/unsubscribe?email=${userEmail}`} style={link}>
                Unsubscribe
              </Link>
              {" • "}
              <Link href={`https://dbg1.netlify.app/settings`} style={link}>
                Update Preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#333',
  margin: '0 0 10px',
};

const subheading: React.CSSProperties = {
  fontSize: '16px',
  color: '#666',
  margin: '0 0 5px',
};

const categoriesStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#888',
  margin: '8px 0 0',
};

const newsItem: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '15px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const categoryRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const categoryTag: React.CSSProperties = {
  backgroundColor: '#e6f2ff',
  color: '#0066cc',
  fontSize: '12px',
  fontWeight: '500',
  padding: '4px 8px',
  borderRadius: '12px',
};

const sourceText: React.CSSProperties = {
  fontSize: '12px',
  color: '#999',
  margin: '0',
};

const newsTitle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 12px',
};

const titleLink: React.CSSProperties = {
  color: '#333',
  textDecoration: 'none',
};

const summary: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#444',
  margin: '0 0 12px',
};

const readMore: React.CSSProperties = {
  color: '#0066cc',
  fontSize: '14px',
  textDecoration: 'none',
  fontWeight: '500',
};

const footer: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '30px',
};

const footerText: React.CSSProperties = {
  fontSize: '16px',
  color: '#666',
  textAlign: 'center',
  margin: '0 0 15px',
};

const hr: React.CSSProperties = {
  borderColor: '#e6e6e6',
  margin: '15px 0',
};

const unsubscribeText: React.CSSProperties = {
  fontSize: '12px',
  color: '#999',
  textAlign: 'center',
};

const link: React.CSSProperties = {
  color: '#999',
  textDecoration: 'underline',
};

export default DailyDigestEmail;
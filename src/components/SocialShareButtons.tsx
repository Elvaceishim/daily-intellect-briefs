import { Button, Stack } from '@mui/material';

interface SocialShareButtonsProps {
  shareUrl: string;
  title: string;
  summary: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ shareUrl, title, summary }) => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on X
      </Button>
      <Button
        variant="outlined"
        color="primary"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on LinkedIn
      </Button>
      {/* Add more platforms as needed */}
    </Stack>
  );
};

export default SocialShareButtons;
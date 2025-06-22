import { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { Clock } from 'lucide-react';

interface NextBriefCountdownProps {
  targetTime?: string;
}

const NextBriefCountdown = ({ targetTime = "08:00" }: NextBriefCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('Loading...');
  const [isToday, setIsToday] = useState<boolean>(true);

  useEffect(() => {
    console.log('NextBriefCountdown mounted with targetTime:', targetTime);

    const updateCountdown = () => {
      const now = new Date();
      const today = new Date();
      
      const [hours, minutes] = targetTime.split(':').map(Number);
      
      const todayTarget = new Date();
      todayTarget.setHours(hours, minutes, 0, 0);
      
      const tomorrowTarget = new Date();
      tomorrowTarget.setDate(today.getDate() + 1);
      tomorrowTarget.setHours(hours, minutes, 0, 0);
      
      let targetDate: Date;
      let isTodayTarget: boolean;
      
      if (now > todayTarget) {
        targetDate = tomorrowTarget;
        isTodayTarget = false;
      } else {
        targetDate = todayTarget;
        isTodayTarget = true;
      }
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000); // Add seconds back
        
        // Show hours, minutes, and seconds for live updating
        setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
        setIsToday(isTodayTarget);
      } else {
        setTimeLeft('Sending now...');
        setIsToday(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // ← Change from 60000 to 1000 (every second)
    return () => clearInterval(interval);
  }, [targetTime]);

  const getFormattedTime = () => {
    const [hours, minutes] = targetTime.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes);
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <Chip
      icon={<Clock size={14} />}
      label={`Next: ${timeLeft}`}
      color="success"
      variant="outlined"
      size="small"
      sx={{
        maxWidth: '160px', // Slightly wider to accommodate seconds
        minWidth: '160px',
        height: '32px',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        fontWeight: 500,
        animation: 'pulse 2s infinite', // Add subtle pulse animation
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 1 },
        },
        '& .MuiChip-label': {
          paddingLeft: '4px',
          paddingRight: '8px',
          fontSize: '0.65rem', // Slightly smaller to fit seconds
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        '& .MuiChip-icon': {
          marginLeft: '8px',
          marginRight: '2px'
        }
      }}
      title={`Next brief scheduled for ${getFormattedTime()} ${isToday ? 'today' : 'tomorrow'}`}
    />
  );
};

export default NextBriefCountdown;
import { Dispatch, SetStateAction, useState } from 'react';

type SummaryModeToggleProps = {
  mode: 'gist' | 'brainy';
  setMode: Dispatch<SetStateAction<'gist' | 'brainy'>>;
};

export function SummaryModeToggle({ mode, setMode }: SummaryModeToggleProps) {
  return (
    <div>
      <button onClick={() => setMode('gist')} disabled={mode === 'gist'}>
        ⚡ Just the Gist
      </button>
      <button onClick={() => setMode('brainy')} disabled={mode === 'brainy'}>
        🧠 More Brainy
      </button>
    </div>
  );
}

// Define the type for summaries prop
type Summaries = {
  gist?: string;
  brainy?: string;
} | null | undefined;

type BriefCardProps = {
  summaries: Summaries;
};

export default function BriefCard({ summaries }: BriefCardProps) {
  const [mode, setMode] = useState<'gist' | 'brainy'>('gist');

  // Safe access to summaries with fallbacks
  const safeSummaries = {
    gist: summaries?.gist || '',
    brainy: summaries?.brainy || ''
  };

  // Alternative approach: Early return if no summaries
  if (!summaries) {
    return (
      <div>
        <SummaryModeToggle mode={mode} setMode={setMode} />
        <div>
          <em>No summaries available</em>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SummaryModeToggle mode={mode} setMode={setMode} />
      <div>
        {mode === 'gist' 
          ? (safeSummaries.gist || <em>No gist summary available</em>)
          : (safeSummaries.brainy || <em>No brainy summary available</em>)
        }
      </div>
    </div>
  );
}
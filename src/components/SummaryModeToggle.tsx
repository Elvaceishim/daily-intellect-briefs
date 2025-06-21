import { useState, Dispatch, SetStateAction } from 'react';

type SummaryMode = 'gist' | 'brainy';

interface SummaryModeToggleProps {
  mode: SummaryMode;
  setMode: Dispatch<SetStateAction<SummaryMode>>;
}

function SummaryModeToggle({ mode, setMode }: SummaryModeToggleProps) {
  // Implement your toggle UI here
  return (
    <div>
      <button
        onClick={() => setMode('gist')}
        disabled={mode === 'gist'}
      >
        Gist
      </button>
      <button
        onClick={() => setMode('brainy')}
        disabled={mode === 'brainy'}
      >
        Brainy
      </button>
    </div>
  );
}

export default function BriefCard({ summaries }) {
  const [mode, setMode] = useState<SummaryMode>('gist');
  
  return (
    <div>
      <SummaryModeToggle mode={mode} setMode={setMode} />
      <div>
        {mode === 'gist' 
          ? (summaries?.gist || 'No gist summary available')
          : (summaries?.brainy || 'No brainy summary available')
        }
      </div>
    </div>
  );
}


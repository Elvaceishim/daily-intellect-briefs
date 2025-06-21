import { Dispatch, SetStateAction, useState } from 'react';

type SummaryMode = 'gist' | 'brainy';

type SummaryModeToggleProps = {
  mode: SummaryMode;
  setMode: Dispatch<SetStateAction<SummaryMode>>;
};

function SummaryModeToggle({ mode, setMode }: SummaryModeToggleProps) {
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
      <div>{mode === 'gist' ? summaries.gist : summaries.brainy}</div>
    </div>
  );
}
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

export default function BriefCard({ summaries }) {
  const [mode, setMode] = useState<'gist' | 'brainy'>('gist');
  return (
    <div>
      <SummaryModeToggle mode={mode} setMode={setMode} />
      <div>{mode === 'gist' ? summaries.gist : summaries.brainy}</div>
    </div>
  );
}
// src/components/DeliveryFormatsSelector.tsx
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const formats = [
  { value: 'web', label: 'Web Dashboard' },
  { value: 'email', label: 'Email Summary' },
  { value: 'shareable', label: 'Shareable Link' },
  { value: 'tweet', label: 'Tweetable TL;DR' },
];

export default function DeliveryFormatsSelector({ selected, onChange }) {
  return (
    <FormGroup>
      {formats.map(f => (
        <FormControlLabel
          key={f.value}
          control={
            <Checkbox
              checked={selected.includes(f.value)}
              onChange={e => {
                if (e.target.checked) onChange([...selected, f.value]);
                else onChange(selected.filter(v => v !== f.value));
              }}
            />
          }
          label={f.label}
        />
      ))}
    </FormGroup>
  );
}
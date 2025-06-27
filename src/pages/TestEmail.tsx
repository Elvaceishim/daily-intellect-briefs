// Example: src/pages/TestEmail.tsx
import React, { useState } from 'react';

const TestEmail = () => {
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  const sendTestEmail = async () => {
    setStatus('Sending...');
    const res = await fetch('/.netlify/functions/send-daily-briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('Email sent! Check your inbox.');
    } else {
      setStatus('Failed to send email.');
    }
  };

  const sendRealEmail = async () => {
    setStatus('Sending...');
    const res = await fetch('/.netlify/functions/send-daily-briefs', {
      method: 'POST'
    });
    if (res.ok) {
      setStatus('Real news email sent! Check your inbox.');
    } else {
      setStatus('Failed to send real news email.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ marginRight: 8, padding: 8 }}
      />
      <button onClick={sendRealEmail}>Send Email</button>
      <div>{status}</div>
    </div>
  );
};

export default TestEmail;
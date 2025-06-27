// Example: src/pages/TestEmail.tsx
import React, { useState } from 'react';

const TestEmail = () => {
  const [status, setStatus] = useState('');

  const sendTestEmail = async () => {
    setStatus('Sending...');
    const res = await fetch('/.netlify/functions/sendEmail'); // or your function name
    if (res.ok) {
      setStatus('Email sent! Check your inbox.');
    } else {
      setStatus('Failed to send email.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={sendTestEmail}>Send Test Email</button>
      <div>{status}</div>
    </div>
  );
};

export default TestEmail;
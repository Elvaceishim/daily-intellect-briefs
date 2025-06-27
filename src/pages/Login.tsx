import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: User submits email/password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If login is successful, navigate to briefs
    if (data.session) {
      navigate('/briefs');
    } else {
      // If session is not present, assume OTP is required
      setOtpSent(true);
    }
    setLoading(false);
  };

  // Step 2: User enters OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error) {
      setError(error.message);
    } else {
      navigate('/briefs');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={otpSent ? handleVerifyOtp : handleLogin}
        style={{
          background: '#fff',
          padding: '2.5rem 1.5rem',
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <h2 style={{ color: '#2563eb', textAlign: 'center', fontWeight: 700 }}>
          {otpSent ? 'Enter OTP' : 'Login'}
        </h2>
        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 0',
                borderRadius: 999,
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                fontSize: 18,
                marginTop: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP from your email"
              value={otp}
              required
              onChange={e => setOtp(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 0',
                borderRadius: 999,
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                fontSize: 18,
                marginTop: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
        {error && (
          <div style={{ color: '#ef4444', marginTop: 8, textAlign: 'center', fontWeight: 500, fontSize: 15 }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
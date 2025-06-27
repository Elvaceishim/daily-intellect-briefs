import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
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

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email above first.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
      setMessage('');
    } else {
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #2563eb 100%)',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        padding: '0 8px',
        position: 'relative',
      }}
    >
      <h3
        style={{
          margin: 0,
          color: '#2563eb',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          letterSpacing: '-0.5px',
          marginTop: '8rem', // pushes heading downward from the very top
          marginBottom: '7rem', // space between heading and login box
          textAlign: 'center',
          width: '100%',
          lineHeight: 1.1,
        }}
      >
        Your Daily Briefs
      </h3>
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
        {message && (
          <div style={{ color: '#2563eb', marginTop: 8, textAlign: 'center', fontWeight: 500, fontSize: 15 }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ color: '#ef4444', marginTop: 8, textAlign: 'center', fontWeight: 500, fontSize: 15 }}>
            {error}
          </div>
        )}
      </form>
      <div
        style={{
          marginTop: '2rem',
          color: '#2563eb',
          fontWeight: 500,
          fontSize: 15,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <a
          href="#"
          style={{
            color: '#2563eb',
            fontSize: 14,
            marginTop: 2,
            textAlign: 'right',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </a>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 15,
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};


export default Login;
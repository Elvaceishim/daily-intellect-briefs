import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let result;
    if (isRegister) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/briefs');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #2563eb 100%)',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        padding: '0 8px',
      }}
    >
      <form
        onSubmit={handleAuth}
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
        <h2 style={{
          margin: 0,
          color: '#2563eb',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.7rem',
          letterSpacing: '-0.5px'
        }}>
          {isRegister ? 'Register' : 'Login'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email" style={{ fontWeight: 500, color: '#374151' }}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            style={{
              padding: '0.75rem',
              borderRadius: 8,
              border: error ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
              fontSize: 16,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              background: '#f8fafc'
            }}
            onChange={e => setEmail(e.target.value)}
          />
          {error && (
            <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
              {error}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontWeight: 500, color: '#374151' }}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            style={{
              padding: '0.75rem',
              borderRadius: 8,
              border: error ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
              fontSize: 16,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              background: '#f8fafc'
            }}
            onChange={e => setPassword(e.target.value)}
          />
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
            onClick={e => {
              e.preventDefault();
              alert('Forgot password functionality coming soon!');
            }}
          >
            Forgot Password?
          </a>
        </div>
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
            boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
        </button>
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15,
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
        {error && (
          <div style={{ color: '#ef4444', marginTop: 8, textAlign: 'center', fontWeight: 500, fontSize: 15 }}>
            {error}
          </div>
        )}
      </form>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
    </div>
  );
};

export default Login;
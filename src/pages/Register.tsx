// filepath: src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // 1. Sign up with Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into custom users table
    const { error: dbError } = await supabase.from('users').insert([
      {
        email: 'user@example.com',
        name: 'User',
        preferences: {
          selectedTopics: ['technology'],
          preferredTime: '08:00',
          emailEnabled: true,
        },
        createdat: new Date().toISOString(),
      },
    ]);
    if (dbError) {
      setError('Database error creating new user');
      setLoading(false);
      return;
    }

    setMessage('Registration successful! Please check your email to confirm your account.');
    setLoading(false);
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #2563eb 100%)',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        padding: '0 8px',
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
        onSubmit={handleRegister}
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
          fontSize: '2rem',
          letterSpacing: '-0.5px'
        }}>
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
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
            boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
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
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
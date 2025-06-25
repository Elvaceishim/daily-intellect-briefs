import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
        background: 'linear-gradient(120deg, #e75480 0%, #a890fe 100%)',
        width: '100vw',
        boxSizing: 'border-box',
        padding: '0 8px',
        zIndex: 2,
        position: 'relative',
      }}
    >
      <form
        onSubmit={handleAuth}
        style={{
          background: 'white',
          padding: '40px 24px',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          margin: '0 auto',
          zIndex: 3,
          position: 'relative',
        }}
      >
        <h2 style={{ margin: 0, color: '#e75480', textAlign: 'center', fontWeight: 700 }}>
          {isRegister ? 'Register' : 'Login'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 6, color: '#444' }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            style={{
              padding: 14,
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
              marginBottom: 0,
              outline: 'none',
              transition: 'border 0.2s',
            }}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 6, color: '#444' }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            style={{
              padding: 14,
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
              marginBottom: 0,
              outline: 'none',
              transition: 'border 0.2s',
            }}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 0',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #e75480, #a890fe)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            fontSize: 18,
            marginTop: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px 0 rgba(167,144,254,0.10)',
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
              color: '#a890fe',
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
          <div style={{ color: '#e75480', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
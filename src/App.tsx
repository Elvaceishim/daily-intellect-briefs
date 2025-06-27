import React, { useState, useEffect } from 'react';
import { CssBaseline, Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesGrid from './components/FeaturesGrid';
import Login from './pages/Login';
import Register from './pages/Register';
import BriefsPage from './pages/BriefsPage';
import TestEmail from './pages/TestEmail';

const App = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userEmail');
    if (saved) setUserEmail(saved);
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
  };

  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={
            userEmail
              ? <BriefsPage userEmail={userEmail} />
              : <Hero />
          } />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/briefs" element={<BriefsPage />} />
          <Route path="/test-email" element={<TestEmail />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
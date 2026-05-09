import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Import your page components
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import UpdatePassword from './components/UpdatePassword.jsx';

// Import your CSS
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Helper for safe storage access
  const safeStorage = {
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('LocalStorage access denied', e);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('LocalStorage access denied', e);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage access denied', e);
      }
    }
  };

  const handleLogin = useCallback((session) => {
    setToken(session.access_token);
    safeStorage.setItem('token', session.access_token);
    navigate('/dashboard');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setToken(null);
    safeStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    // Check for an existing session in localStorage
    const savedToken = safeStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          handleLogout();
        } else {
          setToken(savedToken);
        }
      } catch (e) {
        console.error('Invalid token', e);
        handleLogout();
      }
    }
  }, [handleLogout]); 

  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={<Signup onLogin={handleLogin} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/update-password"
          element={<UpdatePassword onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            token ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
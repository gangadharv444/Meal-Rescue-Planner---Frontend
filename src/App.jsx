import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

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

  // 2. Wrap handleLogin in useCallback
  // This memoizes the function so it doesn't get recreated on every render
  const handleLogin = useCallback((session) => {
    setToken(session.access_token);
    localStorage.setItem('token', session.access_token);
    navigate('/dashboard');
  }, [navigate]); // It only depends on 'navigate'

  // 3. Wrap handleLogout in useCallback
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]); // It only depends on 'navigate'

  // --- THIS IS THE UPDATED PART ---
  useEffect(() => {
    // 1. Check for an existing session in localStorage
    const session = localStorage.getItem('token');
    if (session) {
      setToken(session);
    }

    // 2. Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Supabase Auth Event: ${event}`);

        if (event === 'PASSWORD_RECOVERY') {
          // User clicked a reset link
          setToken(session.access_token);
          navigate('/update-password');
        } else if (event === 'SIGNED_IN') {
          console.log('Signed In session detected');
          // Important: Don't redirect to dashboard if we are on the update-password page!
          // This allows the user to actually see the form to type their new password.
          if (window.location.pathname === '/update-password' || window.location.hash.includes('type=recovery')) {
            setToken(session.access_token);
            // Do NOT navigate to /dashboard
          } else {
            handleLogin(session);
          }
        } else if (event === 'SIGNED_OUT') {
          setToken(null);
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    );

    // 3. Clean up the listener
    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [navigate, handleLogin, handleLogout]); // 4. Add the functions to the dependency array

  return (
    <>
      <Routes>

        {/* Route 1: The Dashboard (Protected) */}
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

        {/* Route 2: The Signup Page */}
        <Route
          path="/signup"
          element={<Signup onLogin={handleLogin} />}
        />

        {/* Route 3: The "Forgot Password" Pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/update-password"
          element={<UpdatePassword onLogin={handleLogin} />}
        />

        {/* Route 4: The Login Page (Home Page) */}
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
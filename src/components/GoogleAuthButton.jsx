import React from 'react';
import { supabase } from '../supabaseClient'; // Import our new client

function GoogleAuthButton({ text, onError }) {

  const handleGoogleAuth = async () => {
    try {
      // This one function handles both login and signup
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      // Send the error message to the parent (Login or Signup page)
      onError(err.message);
    }
  };

  return (
    <button onClick={handleGoogleAuth} style={{ marginTop: '10px' }}>
      {text}
    </button>
  );
}

export default GoogleAuthButton;
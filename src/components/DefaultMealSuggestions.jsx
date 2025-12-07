import React, { useState } from 'react';
import axios from 'axios';

function DefaultMealSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // This function is called when a user clicks a tag button
  const getSuggestions = async (tag) => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/default-meals?tag=${tag}`
      );
      setSuggestions(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to get suggestions');
    }
  };

  return (
    <div>
      <h3>Welcome! Let's get you started.</h3>
      <p>Your meal vault is empty. Here are some ideas based on your taste:</p>
      
      {/* --- The Tag Buttons --- */}
      <div>
        <button onClick={() => getSuggestions('spicy')}>Find Spicy Meals</button>
        <button onClick={() => getSuggestions('sweet')} style={{ marginLeft: '10px' }}>Find Sweet Meals</button>
        <button onClick={() => getSuggestions('salty')} style={{ marginLeft: '10px' }}>Find Salty Meals</button>
      </div>

      {/* --- Displaying the Results --- */}
      {loading && <p>Finding meals...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {suggestions.length > 0 && (
        <ul style={{ marginTop: '20px' }}>
          {suggestions.map((meal) => (
            <li key={meal.meal_name}>
              {meal.meal_name}
              <span style={{ marginLeft: '10px', color: '#888' }}>
                (Tags: {meal.Tags.join(', ')})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DefaultMealSuggestions;
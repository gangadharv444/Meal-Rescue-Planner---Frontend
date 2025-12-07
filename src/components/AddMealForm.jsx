import React, { useState } from 'react';
import axios from 'axios';
import { TextInput, Button, Group, Stack } from '@mantine/core';
import { API_URL } from '../config';

function AddMealForm({ token, onMealAdded }) {
  const [mealName, setMealName] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mealName.trim()) return;

    setError(null);
    setLoading(true);

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

    try {
      const response = await axios.post(
        `${API_URL}/meals`,
        { mealName, Tags: tagsArray },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setLoading(false);
      setMealName('');
      setTags('');
      onMealAdded(response.data);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to add meal');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xs">
        <TextInput
          placeholder="New Meal Name (e.g. Tacos)"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          required
        />
        <TextInput
          placeholder="Tags (dinner, spicy...)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button type="submit" loading={loading} fullWidth variant="light">
          Add to Vault
        </Button>
        {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
      </Stack>
    </form>
  );
}

export default AddMealForm;
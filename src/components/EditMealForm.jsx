import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, TextInput, Button, Group, Title, Stack } from '@mantine/core';
import { API_URL } from '../config';

function EditMealForm({ meal, token, onMealUpdated, onCancel }) {
  const [mealName, setMealName] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meal) {
      setMealName(meal.meal_name);
      setTags(meal.Tags ? meal.Tags.join(', ') : '');
    }
  }, [meal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const tagsArray = tags.split(',').map(tag => tag.trim());

    try {
      const response = await axios.put(
        `${API_URL}/meals/${meal.id}`,
        { mealName, Tags: tagsArray },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setLoading(false);
      onMealUpdated(response.data);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to update meal');
    }
  };

  if (!meal) return null;

  return (
    <Card shadow="xl" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">Edit Meal</Title>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Meal Name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            required
          />
          <TextInput
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}

export default EditMealForm;
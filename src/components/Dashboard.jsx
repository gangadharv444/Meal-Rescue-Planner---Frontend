import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AppShell, Container, Group, Title, Button, Text,
  Card, Badge, Grid, Select, Stack,
  Loader, Paper
} from '@mantine/core';
import { IconLogout, IconRefresh, IconChefHat, IconCalendar, IconDatabase } from '@tabler/icons-react';

import MealList from './MealList.jsx';
import AddMealForm from './AddMealForm.jsx';
import PlanDisplay from './PlanDisplay.jsx';
import DefaultMealSuggestions from './DefaultMealSuggestions.jsx';
import EditMealForm from './EditMealForm.jsx';
import { ThemeToggle } from './ThemeToggle';
import { API_URL } from '../config';

const Icons = {
  Logout: () => <span>🚪</span>,
  Refresh: () => <span>🔄</span>,
  Chef: () => <span>👨‍🍳</span>,
  Calendar: () => <span>📅</span>,
  Database: () => <span>💾</span>
};

function Dashboard({ token, onLogout }) {
  const queryClient = useQueryClient();

  const [suggestion, setSuggestion] = useState(null);
  const [suggestionError, setSuggestionError] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const [editingMeal, setEditingMeal] = useState(null);
  const [dietType, setDietType] = useState('anything');

  // React Query: Fetch Meals
  const { data: meals = [], isLoading: loading, error: fetchError } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      let res = await axios.get(`${API_URL}/meals`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.data || res.data.length === 0) {
        await axios.post(`${API_URL}/ensure-defaults`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        res = await axios.get(`${API_URL}/meals`, { headers: { 'Authorization': `Bearer ${token}` } });
      }
      return res.data;
    },
    enabled: !!token
  });

  // React Query: Delete Meal
  const deleteMutation = useMutation({
    mutationFn: (mealId) => axios.delete(`${API_URL}/meals/${mealId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
    onSuccess: () => queryClient.invalidateQueries(['meals'])
  });

  const handleDeleteMeal = (mealId) => {
    deleteMutation.mutate(mealId);
  };

  const handleMealAdded = () => {
    queryClient.invalidateQueries(['meals']);
  };

  const handleMealUpdated = () => {
    queryClient.invalidateQueries(['meals']);
    setEditingMeal(null);
  };

  const handleCancelEdit = () => setEditingMeal(null);
  const handleEditClick = (meal) => setEditingMeal(meal);

  const handleGetSuggestion = (excludeId = null) => {
    if (!navigator.geolocation) {
      setSuggestionError("Geolocation needed for weather features.");
      return;
    }
    setSuggestionLoading(true);
    setSuggestionError(null);
    if (!excludeId) setSuggestion(null);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const currentHour = new Date().getHours();
      let timePeriod = 'dinner';
      if (currentHour >= 5 && currentHour < 11) timePeriod = 'breakfast';
      else if (currentHour >= 11 && currentHour < 16) timePeriod = 'lunch';

      let url = `${API_URL}/suggestion/weather?lat=${latitude}&lon=${longitude}&timePeriod=${timePeriod}&dietType=${dietType}`;
      if (excludeId) url += `&excludeId=${excludeId}`;

      try {
        const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
        setSuggestion(response.data);
      } catch (err) {
        setSuggestionError(err.response?.data?.error || err.response?.data?.message || 'Failed to get suggestion');
      } finally {
        setSuggestionLoading(false);
      }
    }, () => {
      setSuggestionLoading(false);
      setSuggestionError("Location access denied.");
    });
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    setPlanError(null);
    setPlan(null);
    try {
      const response = await axios.get(`${API_URL}/plan/generate?dietType=${dietType}`, { headers: { 'Authorization': `Bearer ${token}` } });
      setPlan(response.data);
    } catch (err) {
      setPlanError(err.response?.data?.error || 'Failed to generate plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader size="xl" type="dots" />
      </div>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Group>
              <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 90 }}>
                Meal Rescue Plan
              </Text>
            </Group>
            <Group>
              <ThemeToggle />
              <Button variant="subtle" color="gray" onClick={onLogout} leftSection={<Icons.Logout />}>
                Logout
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify="space-between">
                    <Text fw={500} size="lg"><Icons.Chef /> AI Chef's Choice</Text>
                    <Select
                      size="xs"
                      value={dietType}
                      onChange={setDietType}
                      data={[
                        { value: 'anything', label: 'Anything' },
                        { value: 'vegetarian', label: 'Vegetarian' },
                        { value: 'non-vegetarian', label: 'Non-Vegetarian' },
                      ]}
                      placeholder="Diet Pref"
                      style={{ width: 140 }}
                    />
                  </Group>
                </Card.Section>

                <Stack align="center" mt="md" mb="md" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  {!suggestion && !suggestionLoading && (
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" mb="md">Hungry? Let's find a perfect meal.</Text>
                      <Button size="lg" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={() => handleGetSuggestion()}>
                        Get Suggestion
                      </Button>
                    </div>
                  )}

                  {suggestionLoading && <Loader type="dots" />}

                  {suggestion && (
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Badge size="lg" variant="dot" color="green" mb="sm">Best Match</Badge>
                      <Title order={2} mb="xs">{suggestion.meal_name}</Title>

                      {suggestion.ai_powered && (
                        <Badge variant="gradient" gradient={{ from: 'grape', to: 'pink' }} mb="md">✨ AI Powered</Badge>
                      )}

                      {suggestion.reasoning && (
                        <Paper p="md" bg="var(--mantine-color-body)" withBorder radius="md" mb="md">
                          <Text fs="italic">"{suggestion.reasoning}"</Text>
                        </Paper>
                      )}

                      <Group justify="center" mt="md">
                        {suggestion.Tags && suggestion.Tags.map(tag => (
                          <Badge key={tag} variant="outline" color="gray">{tag}</Badge>
                        ))}
                      </Group>

                      <Button mt="xl" variant="light" color="gray" leftSection={<Icons.Refresh />} onClick={() => handleGetSuggestion(suggestion.id)} loading={suggestionLoading}>
                        Try Another
                      </Button>
                    </div>
                  )}

                  {suggestionError && <Text c="red">{suggestionError}</Text>}
                </Stack>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify="space-between">
                    <Text fw={500}><Icons.Calendar /> Weekly Meal Plan</Text>
                  </Group>
                </Card.Section>

                <Stack align="center" mt="md">
                  {!plan && (
                    <Button onClick={handleGeneratePlan} loading={planLoading} variant="outline">
                      Generate 7-Day Plan
                    </Button>
                  )}
                  {plan && (
                    <div style={{ width: '100%' }}>
                      <PlanDisplay plan={plan} />
                      <Group justify="center" mt="md">
                        <Button size="xs" variant="subtle" onClick={handleGeneratePlan} loading={planLoading}>
                          Regenerate
                        </Button>
                      </Group>
                    </div>
                  )}
                  {planError && <Text c="red">{planError}</Text>}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Card.Section withBorder inheritPadding py="xs">
                  <Text fw={500}><Icons.Database /> Your Meal Vault</Text>
                </Card.Section>

                <Stack mt="md">
                  <AddMealForm token={token} onMealAdded={handleMealAdded} />
                  
                  {/* Replaced Divider with simple visual separator */}
                  <div style={{ margin: '16px 0', borderBottom: '1px solid var(--mantine-color-default-border)' }}></div>

                  {!meals || meals.length === 0 ? (
                    <DefaultMealSuggestions />
                  ) : (
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <MealList
                        meals={meals}
                        error={fetchError ? fetchError.message : null}
                        onDelete={handleDeleteMeal}
                        onEdit={handleEditClick}
                      />
                    </div>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          <Stack align="center" mt={50} mb="xl" gap={5}>
            <Text c="dimmed" size="xs">&copy; Meal Rescue 2025</Text>
          </Stack>
        </Container>
      </AppShell.Main>

      {editingMeal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '90%', maxWidth: '500px' }}>
            <EditMealForm
              meal={editingMeal}
              token={token}
              onMealUpdated={handleMealUpdated}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default Dashboard;
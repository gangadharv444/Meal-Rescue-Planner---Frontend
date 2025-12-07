import React from 'react';
import { Card, Text, Divider, SimpleGrid, Badge, Group, ThemeIcon } from '@mantine/core';
import { IconSun, IconMoon, IconCloud } from '@tabler/icons-react';

// Simplified weather icon logic
const getWeatherIcon = (desc) => {
  if (!desc) return <IconCloud size={16} />;
  if (desc.includes('clear')) return <IconSun size={16} />;
  if (desc.includes('rain')) return <IconCloud size={16} />;
  return <IconCloud size={16} />;
};

function PlanDisplay({ plan }) {
  if (!plan) return null;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="md">
      {plan.map((day, index) => (
        <Card key={index} shadow="sm" radius="md" withBorder padding="sm">
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="sm">{day.day}</Text>
            <Badge variant="light" color="blue" size="xs">{day.date}</Badge>
          </Group>

          <Group gap="xs" mb="md" c="dimmed">
            {getWeatherIcon(day.weather)}
            <Text size="xs">{day.weather}</Text>
          </Group>

          <Divider mb="xs" />

          <div style={{ marginBottom: '8px' }}>
            <Text size="xs" fw={700} c="orange">Breakfast</Text>
            <Text size="xs">{day.breakfast ? day.breakfast.meal_name : '---'}</Text>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Text size="xs" fw={700} c="blue">Lunch</Text>
            <Text size="xs">{day.lunch ? day.lunch.meal_name : '---'}</Text>
          </div>
          <div>
            <Text size="xs" fw={700} c="grape">Dinner</Text>
            <Text size="xs">{day.dinner ? day.dinner.meal_name : '---'}</Text>
          </div>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default PlanDisplay;
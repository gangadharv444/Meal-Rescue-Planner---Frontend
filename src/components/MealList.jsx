import React from 'react';
import { Card, Text, Group, Badge, ActionIcon, List, ThemeIcon, ScrollArea } from '@mantine/core';
import { IconTrash, IconEdit, IconCheck } from '@tabler/icons-react';

// Fallback icons if tabler-icons-react isn't installed
const Icons = {
  Trash: () => <span>🗑️</span>,
  Edit: () => <span>✏️</span>,
  Check: () => <span>✅</span>
};

function MealList({ meals, error, onEdit, onDelete }) {
  if (error) {
    return <Text c="red" size="sm">{error}</Text>;
  }

  if (meals.length === 0) {
    return <Text c="dimmed" size="sm" ta="center" mt="md">You haven't added any meals yet.</Text>;
  }

  return (
    <ScrollArea h={400} offsetScrollbars>
      <List spacing="sm" size="sm" center>
        {meals.map(meal => (
          <Card key={meal.id} withBorder shadow="sm" radius="md" mb="sm" padding="sm">
            <Group justify="space-between">
              <div>
                <Text fw={500}>{meal.meal_name}</Text>
                <Group gap="xs" mt={5}>
                  {meal.Tags && meal.Tags.map(tag => (
                    <Badge key={tag} size="xs" variant="dot" color="gray">{tag}</Badge>
                  ))}
                </Group>
              </div>
              <Group gap="xs">
                <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(meal)}>
                  <Icons.Edit />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={() => onDelete(meal.id)}>
                  <Icons.Trash />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </List>
    </ScrollArea>
  );
}

export default MealList;
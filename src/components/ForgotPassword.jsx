import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

// Import Mantine components
import { Paper, Title, TextInput, Button, Text, Anchor, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { ThemeToggle } from './ThemeToggle';

function ForgotPassword() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values) => {
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setMessage('Check your email for a password reset link.');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <Paper withBorder shadow="md" p="xl" radius="md" style={{ width: 450 }}>
        <Title order={2} ta="center" mb="lg">
          Forgot Password
        </Title>
        <Text size="sm" ta="center" mb="lg">
          Enter your email, and we'll send you a link to reset your password.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />

            {message && (
              <Text c="green" size="sm" ta="center">
                {message}
              </Text>
            )}
            {error && (
              <Text c="red" size="sm" ta="center">
                {error}
              </Text>
            )}

            <Button type="submit" fullWidth>
              Send Reset Link
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="lg">
          <Anchor component={Link} to="/">
            Back to Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

export default ForgotPassword;
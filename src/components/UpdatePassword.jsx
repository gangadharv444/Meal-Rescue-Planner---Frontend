import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, PasswordInput, Button, Text, Stack, Container } from '@mantine/core';
import { useForm } from '@mantine/form';

import { ThemeToggle } from './ThemeToggle';

function UpdatePassword({ onLogin }) {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  useEffect(() => {
    // Check if we have a session (handled by App.jsx or direct URL access)
    // We don't need to call getSessionFromUrl here if App.jsx handles the session set, 
    // but redundant check is fine.
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onLogin(data.session); // Ensure parent knows we are logged in
      }
    };
    checkSession();
  }, [onLogin]);

  const handleSubmit = async (values) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;
      setMessage('Your password has been updated successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title order={2} ta="center" mb="md">Reset Password</Title>
          <Text c="dimmed" size="sm" ta="center" mb="lg">
            Enter your new password below.
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <PasswordInput
                label="New Password"
                placeholder="Your new password"
                required
                {...form.getInputProps('password')}
              />

              {message && <Text c="green" size="sm" ta="center">{message}</Text>}
              {error && <Text c="red" size="sm" ta="center">{error}</Text>}

              <Button type="submit" fullWidth loading={loading}>
                Update Password
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default UpdatePassword;
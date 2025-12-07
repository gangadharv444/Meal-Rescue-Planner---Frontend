import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_URL } from '../config';

// Mantine components
import {
  Paper, Title, TextInput, PasswordInput, Button, Text, Anchor,
  Stack, Divider, Container, Group
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { ThemeToggle } from './ThemeToggle';
import { GoogleIcon } from './GoogleIcon';

function Signup({ onLogin }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    setError(null);
    try {
      await axios.post(
        `${API_URL}/signup`,
        { email: values.email, password: values.password }
      );

      // Auto login after signup
      const response = await axios.post(
        `${API_URL}/login`,
        { email: values.email, password: values.password }
      );

      onLogin(response.data.session);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'var(--mantine-color-body)',
      color: 'var(--mantine-color-text)'
    }}>

      {/* Theme Toggle Top Right */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <Container size={420} my={40}>
        <Text
          size="xl"
          fw={900}
          ta="center"
          variant="gradient"
          gradient={{ from: 'orange', to: 'red', deg: 90 }}
          style={{ fontFamily: 'Greycliff CF, sans-serif', fontSize: '30px', marginBottom: '10px' }}
        >
          Meal Rescue Planner
        </Text>
        <Title ta="center" c="var(--mantine-color-text)" order={1} style={{ fontFamily: 'Greycliff CF, sans-serif' }}>
          Create an account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{' '}
          <Anchor size="sm" component={Link} to="/">
            Login
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="you@mantine.dev"
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                {...form.getInputProps('password')}
              />

              {error && (
                <Text c="red" size="sm" ta="center">
                  {error}
                </Text>
              )}

              <Button fullWidth mt="xl" type="submit">
                Sign Up
              </Button>
            </Stack>
          </form>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Button
            fullWidth
            variant="default"
            leftSection={<GoogleIcon />}
            onClick={handleGoogleAuth}
          >
            Continue with Google
          </Button>

        </Paper>
      </Container>
    </div>
  );
}

export default Signup;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Import Mantine
import { MantineProvider } from '@mantine/core';

// 2. Import the base Mantine CSS
import '@mantine/core/styles.css';

import ErrorBoundary from './ErrorBoundary.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap your app in the MantineProvider */}
    <MantineProvider defaultColorScheme="dark">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </MantineProvider>
  </React.StrictMode>,
);
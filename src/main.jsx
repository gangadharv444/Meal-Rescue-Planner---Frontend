import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// 1. Import Mantine
import { MantineProvider } from '@mantine/core';

// 2. Import the base Mantine CSS
import '@mantine/core/styles.css';

import ErrorBoundary from './ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap your app in the MantineProvider */}
    <MantineProvider defaultColorScheme="dark">
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </MantineProvider>
  </React.StrictMode>,
);
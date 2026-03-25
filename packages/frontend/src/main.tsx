import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import App from './App.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" />
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </MantineProvider>
  </StrictMode>,
);

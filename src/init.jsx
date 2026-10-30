import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.jsx';
import ErrorFallback from './components/ErrorFallback.jsx';
import {
  StoresContext,
  createStores,
  hydrateAuthFromStorage,
} from './context/stores.jsx';
import i18n from './i18n.js';
import Sentry from './sentry.js';
import './index.css';

async function init(socket) {
  const stores = createStores();
  hydrateAuthFromStorage(stores.auth);
  const queryClient = new QueryClient();

  return (
    <StoresContext.Provider value={stores}>
      <I18nextProvider i18n={i18n}>
        <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
          <MantineProvider>
            <Notifications position="top-right" />
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <App socket={socket} />
              </BrowserRouter>
            </QueryClientProvider>
          </MantineProvider>
        </Sentry.ErrorBoundary>
      </I18nextProvider>
    </StoresContext.Provider>
  );
}

export default init;

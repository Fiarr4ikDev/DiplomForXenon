import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useMediaQuery } from '@mui/material';

import { getTheme } from './theme';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PartsPage from './pages/PartsPage';
import CategoriesPage from './pages/CategoriesPage';
import SuppliersPage from './pages/SuppliersPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import ConfigurationPage from './pages/ConfigurationPage';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { settings } = useSettings();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const currentTheme = settings.theme === 'system' 
    ? (prefersDarkMode ? 'dark' : 'light')
    : settings.theme;

  const theme = getTheme(currentTheme, settings.primaryColor, settings);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/parts" element={<PartsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

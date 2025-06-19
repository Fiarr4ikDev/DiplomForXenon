import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Компонент для рендеринга содержимого приложения с темой и маршрутами.
 * @returns JSX.Element
 */
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/parts" element={
                <ProtectedRoute>
                  <PartsPage />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              } />
              <Route path="/suppliers" element={
                <ProtectedRoute>
                  <SuppliersPage />
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/configuration" element={
                <ProtectedRoute>
                  <ConfigurationPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
  );
};

/**
 * Корневой компонент приложения.
 * @returns JSX.Element
 */
const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
  );
};

export default App;
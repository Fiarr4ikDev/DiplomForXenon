import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PartsPage from './pages/PartsPage';
import SuppliersPage from './pages/SuppliersPage';
import CategoriesPage from './pages/CategoriesPage';
import InventoryPage from './pages/InventoryPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/parts" element={<PartsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

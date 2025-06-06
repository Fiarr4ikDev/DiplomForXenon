import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingState } from '../components/LoadingState';

const API_URL = 'http://localhost:8080/api';

const HomePage: React.FC = () => {
  const { data: partsCount, isLoading: partsLoading, error: partsError, refetch: refetchParts } = useQuery({
    queryKey: ['parts-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts/count`);
      return response.data;
    },
  });

  const { data: suppliersCount, isLoading: suppliersLoading, error: suppliersError, refetch: refetchSuppliers } = useQuery({
    queryKey: ['suppliers-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/suppliers/count`);
      return response.data;
    },
  });

  const { data: categoriesCount, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ['categories-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories/count`);
      return response.data;
    },
  });

  const { data: inventoryCount, isLoading: inventoryLoading, error: inventoryError, refetch: refetchInventory } = useQuery({
    queryKey: ['inventory-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inventory/count`);
      return response.data;
    },
  });

  const isLoading = partsLoading || suppliersLoading || categoriesLoading || inventoryLoading;
  const error = partsError || suppliersError || categoriesError || inventoryError;

  const handleRetry = () => {
    refetchParts();
    refetchSuppliers();
    refetchCategories();
    refetchInventory();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в систему управления запчастями
      </Typography>
      
      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={handleRetry}
        loadingText="Загрузка статистики и метрик..."
      />

      {!isLoading && !error && (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 3,
            mt: 2 
          }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Запчасти</Typography>
              <Typography variant="h4">{partsCount || 0}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Поставщики</Typography>
              <Typography variant="h4">{suppliersCount || 0}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Категории</Typography>
              <Typography variant="h4">{categoriesCount || 0}</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Записи инвентаря</Typography>
              <Typography variant="h4">{inventoryCount || 0}</Typography>
            </Paper>
          </Box>

          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              О системе
            </Typography>
            <Typography paragraph>
              Система управления запчастями позволяет эффективно управлять складом автомобильных запчастей.
              Вы можете:
            </Typography>
            <ul>
              <li>Управлять каталогом запчастей</li>
              <li>Отслеживать поставщиков</li>
              <li>Организовывать категории запчастей</li>
              <li>Контролировать складские запасы</li>
            </ul>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default HomePage; 
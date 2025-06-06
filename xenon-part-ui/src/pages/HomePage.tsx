import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const HomePage: React.FC = () => {
  const { data: partsCount } = useQuery({
    queryKey: ['parts-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts/count`);
      return response.data;
    },
  });

  const { data: suppliersCount } = useQuery({
    queryKey: ['suppliers-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/suppliers/count`);
      return response.data;
    },
  });

  const { data: categoriesCount } = useQuery({
    queryKey: ['categories-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories/count`);
      return response.data;
    },
  });

  const { data: inventoryCount } = useQuery({
    queryKey: ['inventory-count'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inventory/count`);
      return response.data;
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в систему управления запчастями
      </Typography>
      
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
    </Box>
  );
};

export default HomePage; 
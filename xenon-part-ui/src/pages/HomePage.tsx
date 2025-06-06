import React from 'react';
import { Box, Typography } from '@mui/material';
import MetricsDashboard from '../components/MetricsDashboard';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>
      <MetricsDashboard />
    </Box>
  );
};

export default HomePage; 
import React from 'react';
import { Box, Typography } from '@mui/material';
import MetricsDashboard from '../components/MetricsDashboard';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary.main" fontWeight={700}>
          Добро пожаловать в систему управления запчастями
        </Typography>
        <Typography variant="h5" gutterBottom color="text.secondary">
          Эффективное управление складом и поставками
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}>
          Это современное веб-приложение для учёта, контроля и анализа запасов автозапчастей и комплектующих. Система позволяет:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3, mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Категории и поставщики</Typography>
            <Typography variant="body2">Ведите справочник категорий и поставщиков, быстро находите нужную информацию.</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Запчасти и инвентарь</Typography>
            <Typography variant="body2">Добавляйте, редактируйте и отслеживайте остатки, контролируйте движение товаров на складе.</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Импорт и аналитика</Typography>
            <Typography variant="body2">Импортируйте данные из Excel, анализируйте метрики и статистику для принятия решений.</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Профиль и безопасность</Typography>
            <Typography variant="body2">Управляйте своим профилем, используйте безопасную авторизацию и хранение данных.</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Начните работу с панели управления или выберите нужный раздел в боковом меню.
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>
      <MetricsDashboard />
    </Box>
  );
};

export default HomePage; 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Fade } from '@mui/material';
import MetricsDashboard from '../components/MetricsDashboard';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import axios from 'axios';
import { API_URL } from '../config';

const HomePage: React.FC = () => {
  const [counts, setCounts] = useState({ categories: 0, suppliers: 0, parts: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [catRes, supRes, partRes] = await Promise.all([
          axios.get(`${API_URL}/categories/count`),
          axios.get(`${API_URL}/suppliers/count`),
          axios.get(`${API_URL}/parts/count`),
        ]);
        setCounts({
          categories: catRes.data,
          suppliers: supRes.data,
          parts: partRes.data,
        });
        setLoaded(true);
      } catch (e) {
        setLoaded(true);
      }
    };
    fetchCounts();
  }, []);

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
      <Fade in={loaded} timeout={700}>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, bgcolor: 'primary.light', color: 'primary.contrastText', minHeight: 120, boxShadow: 6 }}>
              <CategoryIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>Категории</Typography>
              <Typography variant="h4" fontWeight={900}>{counts.categories}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, bgcolor: 'success.light', color: 'success.contrastText', minHeight: 120, boxShadow: 6 }}>
              <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>Поставщики</Typography>
              <Typography variant="h4" fontWeight={900}>{counts.suppliers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={4} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, bgcolor: 'warning.light', color: 'warning.contrastText', minHeight: 120, boxShadow: 6 }}>
              <BuildIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>Запчасти</Typography>
              <Typography variant="h4" fontWeight={900}>{counts.parts}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Fade>
      <Typography variant="h4" gutterBottom>
        Панель управления
      </Typography>
      <MetricsDashboard />
    </Box>
  );
};

export default HomePage; 
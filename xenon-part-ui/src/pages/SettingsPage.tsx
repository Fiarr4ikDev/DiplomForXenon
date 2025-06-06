import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Grid,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { styled } from '@mui/material/styles';
import { useSettings } from '../contexts/SettingsContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const ColorPreview = styled(Box)(({ color }: { color: string }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: color,
  border: '2px solid rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
}));

const colorOptions = [
  { name: 'Синий', value: '#1976d2' },
  { name: 'Зеленый', value: '#2e7d32' },
  { name: 'Красный', value: '#c62828' },
  { name: 'Фиолетовый', value: '#6a1b9a' },
  { name: 'Оранжевый', value: '#ef6c00' },
  { name: 'Бирюзовый', value: '#00838f' },
  { name: 'Розовый', value: '#c2185b' },
  { name: 'Коричневый', value: '#4e342e' },
];

const ColorOption = ({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: color,
      cursor: 'pointer',
      border: selected ? '3px solid #fff' : 'none',
      boxShadow: selected ? '0 0 0 2px #1976d2' : 'none',
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    }}
  />
);

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });

  const handleThemeChange = (event: SelectChangeEvent) => {
    const newTheme = event.target.value as 'light' | 'dark' | 'system';
    updateSettings({ theme: newTheme });
    showNotification('Тема успешно изменена');
  };

  const handleColorChange = (color: string) => {
    updateSettings({ primaryColor: color });
    showNotification('Основной цвет успешно изменен');
  };

  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    updateSettings({ fontSize: newValue as number });
    showNotification('Размер шрифта изменен');
  };

  const handleDensityChange = (event: SelectChangeEvent) => {
    updateSettings({ density: event.target.value as 'comfortable' | 'compact' | 'spacious' });
    showNotification('Плотность интерфейса изменена');
  };

  const handleAnimationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ animations: event.target.checked });
    showNotification(event.target.checked ? 'Анимации включены' : 'Анимации выключены');
  };

  const handleRoundedCornersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ roundedCorners: event.target.checked });
    showNotification(event.target.checked ? 'Скругленные углы включены' : 'Скругленные углы выключены');
  };

  const showNotification = (message: string) => {
    setNotification({
      open: true,
      message,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Внешний вид
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Тема</InputLabel>
          <Select
            value={settings.theme}
            label="Тема"
            onChange={handleThemeChange}
          >
            <MenuItem value="light">Светлая</MenuItem>
            <MenuItem value="dark">Темная</MenuItem>
            <MenuItem value="system">Системная</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom>
          Основной цвет
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
          {colorOptions.map((color) => (
            <Grid item key={color.value}>
              <ColorOption
                color={color.value}
                selected={settings.primaryColor === color.value}
                onClick={() => handleColorChange(color.value)}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Размер шрифта
        </Typography>
        <Box sx={{ px: 2, mb: 3 }}>
          <Slider
            value={settings.fontSize}
            onChange={handleFontSizeChange}
            min={12}
            max={20}
            step={1}
            marks={[
              { value: 12, label: '12px' },
              { value: 16, label: '16px' },
              { value: 20, label: '20px' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Плотность интерфейса</InputLabel>
          <Select
            value={settings.density}
            label="Плотность интерфейса"
            onChange={handleDensityChange}
          >
            <MenuItem value="comfortable">Комфортная</MenuItem>
            <MenuItem value="compact">Компактная</MenuItem>
            <MenuItem value="spacious">Просторная</MenuItem>
          </Select>
        </FormControl>

        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.animations}
                onChange={handleAnimationsChange}
              />
            }
            label="Анимации интерфейса"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.roundedCorners}
                onChange={handleRoundedCornersChange}
              />
            }
            label="Скругленные углы"
          />
        </Stack>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 
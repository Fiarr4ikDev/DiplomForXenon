import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Stack, Alert } from '@mui/material';

const ConfigurationPage: React.FC = () => {
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [mediumStockThreshold, setMediumStockThreshold] = useState<number>(50);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [lowStockError, setLowStockError] = useState<string | null>(null); // Состояние ошибки для низкого запаса
  const [mediumStockError, setMediumStockError] = useState<string | null>(null); // Состояние ошибки для среднего запаса

  // Загрузка сохраненных значений при монтировании компонента
  useEffect(() => {
    const savedLow = localStorage.getItem('lowStockThreshold');
    const savedMedium = localStorage.getItem('mediumStockThreshold');
    if (savedLow !== null) {
      const numLow = Number(savedLow);
      if (!isNaN(numLow)) {
        setLowStockThreshold(numLow);
      } else {
         setLowStockError('Некорректное сохраненное значение');
      }
    }
    if (savedMedium !== null) {
      const numMedium = Number(savedMedium);
      if (!isNaN(numMedium)) {
        setMediumStockThreshold(numMedium);
      } else {
        setMediumStockError('Некорректное сохраненное значение');
      }
    }
  }, []);

  // Автоматическое скрытие уведомления через несколько секунд
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000); // Скрыть через 5 секунд
      return () => clearTimeout(timer); // Очистка таймера при изменении alert или размонтировании компонента
    }
  }, [alert]); // Зависимость от состояния alert

  const handleSave = () => {
    // Проверка валидности перед сохранением
    if (isNaN(lowStockThreshold) || lowStockThreshold < 0) {
       setAlert({ type: 'error', message: 'Порог низкого запаса должен быть положительным числом.' });
       return;
    }
     if (isNaN(mediumStockThreshold) || mediumStockThreshold <= lowStockThreshold) {
       setAlert({ type: 'error', message: 'Порог среднего запаса должен быть числом больше порога низкого запаса.' });
       return;
    }

    try {
      localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
      localStorage.setItem('mediumStockThreshold', mediumStockThreshold.toString());
      setAlert({ type: 'success', message: 'Настройки успешно сохранены!' });
      setLowStockError(null); // Сброс ошибок после успешного сохранения
      setMediumStockError(null);
    } catch (e) {
      setAlert({ type: 'error', message: 'Ошибка при сохранении настроек.' });
      console.error('Error saving settings to localStorage:', e);
    }
  };

  const handleLoad = () => {
     try {
      const savedLow = localStorage.getItem('lowStockThreshold');
      const savedMedium = localStorage.getItem('mediumStockThreshold');
      let loadedLow = 10;
      let loadedMedium = 50;

      if (savedLow !== null) {
        const numLow = Number(savedLow);
        if (!isNaN(numLow)) {
           loadedLow = numLow;
           setLowStockError(null); // Сброс ошибки если загружено корректное значение
        } else {
          setLowStockError('Некорректное сохраненное значение для низкого запаса.');
        }
      }
      if (savedMedium !== null) {
        const numMedium = Number(savedMedium);
         if (!isNaN(numMedium)) {
          loadedMedium = numMedium;
          setMediumStockError(null); // Сброс ошибки если загружено корректное значение
        } else {
           setMediumStockError('Некорректное сохраненное значение для среднего запаса.');
        }
      }
      // Дополнительная проверка на согласованность загруженных значений
      if (loadedMedium <= loadedLow) {
           setAlert({ type: 'error', message: 'Загруженные настройки некорректны: порог среднего запаса не больше порога низкого запаса.' });
           // Можно сбросить к дефолтным или оставить как есть, но уведомить пользователя
           // setLowStockThreshold(10);
           // setMediumStockThreshold(50);
      } else {
          setLowStockThreshold(loadedLow);
          setMediumStockThreshold(loadedMedium);
           setAlert({ type: 'success', message: 'Настройки загружены!' });
      }

     } catch (e) {
        setAlert({ type: 'error', message: 'Ошибка при загрузке настроек.' });
        console.error('Error loading settings from localStorage:', e);
     }
  };

  const handleReset = () => {
    setLowStockThreshold(10);
    setMediumStockThreshold(50);
    localStorage.removeItem('lowStockThreshold');
    localStorage.removeItem('mediumStockThreshold');
    setAlert({ type: 'success', message: 'Настройки сброшены к значениям по умолчанию.' });
    setLowStockError(null); // Сброс ошибок
    setMediumStockError(null);
  };

   // Валидация при изменении поля низкого запаса
  const handleLowStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setLowStockThreshold(numValue);
      setLowStockError(null);
    } else {
      setLowStockError('Введите положительное число');
    }
     // Также проверяем зависимый порог среднего запаса
    if (!isNaN(numValue) && numValue >= 0 && mediumStockThreshold <= numValue) {
         setMediumStockError('Должно быть больше порога низкого запаса');
    } else if (!isNaN(mediumStockThreshold) && mediumStockThreshold > numValue) {
         setMediumStockError(null);
    }
  };

   // Валидация при изменении поля среднего запаса
  const handleMediumStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);
    if (value === '' || (!isNaN(numValue) && numValue > lowStockThreshold)) {
       setMediumStockThreshold(numValue);
       setMediumStockError(null);
    } else if (!isNaN(numValue) && numValue <= lowStockThreshold) {
        setMediumStockError('Должно быть больше порога низкого запаса');
    } else {
       setMediumStockError('Введите число больше порога низкого запаса');
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Настройка порогов запасов
        </Typography>

        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Здесь вы можете задать пороговые значения количества деталей для определения уровней запасов (низкий, средний, высокий).
        </Typography>

        <Stack spacing={2} direction="column" sx={{ maxWidth: 300, mb: 3 }}>
          <TextField
            label="Порог низкого запаса"
            type="number"
            value={isNaN(lowStockThreshold) ? '' : lowStockThreshold} // Отображаем пустую строку если NaN
            onChange={handleLowStockChange}
            error={!!lowStockError} // true если есть ошибка
            helperText={lowStockError} // Текст ошибки
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 0,
            }}
            fullWidth
          />
          <TextField
            label="Порог среднего запаса"
            type="number"
            value={isNaN(mediumStockThreshold) ? '' : mediumStockThreshold} // Отображаем пустую строку если NaN
            onChange={handleMediumStockChange}
            error={!!mediumStockError}
            helperText={mediumStockError}
             InputLabelProps={{
              shrink: true,
            }}
             inputProps={{
              min: lowStockThreshold >= 0 && !isNaN(lowStockThreshold) ? lowStockThreshold + 1 : 0,
            }}
            fullWidth
          />
        </Stack>

        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleSave} disabled={!!lowStockError || !!mediumStockError}>Сохранить</Button> {/* Отключаем кнопку если есть ошибки */}
          <Button variant="outlined" onClick={handleLoad}>Загрузить</Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>Сбросить</Button>
        </Stack>

      </Paper>
    </Box>
  );
};

export default ConfigurationPage;

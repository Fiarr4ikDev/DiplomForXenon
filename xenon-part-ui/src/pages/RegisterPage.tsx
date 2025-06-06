import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setNotification({
        open: true,
        message: 'Пароли не совпадают',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });

      if (response.status === 201) {
        setNotification({
          open: true,
          message: 'Регистрация успешна! Теперь вы можете войти.',
          severity: 'success'
        });
        // Перенаправление на страницу входа после успешной регистрации
        navigate('/login'); 
      } else {
        setNotification({
          open: true,
          message: response.data || 'Ошибка при регистрации',
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setNotification({
        open: true,
        message: error.response?.data || error.message || 'Произошла ошибка при регистрации',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mt: 5, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           <TextField
            fullWidth
            margin="normal"
            label="Подтвердите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зарегистрироваться
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage; 
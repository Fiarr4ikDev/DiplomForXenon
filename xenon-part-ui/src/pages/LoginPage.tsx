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
  Link as MuiLink
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export interface LoginRequest {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
  const { login } = useAuth(); // Получаем функцию login из AuthContext

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const success = await login({ username, password });
      
      if (success) {
        setNotification({
          open: true,
          message: 'Вход выполнен успешно!',
          severity: 'success'
        });
        navigate('/'); // Перенаправить на главную страницу
      } else {
        setNotification({
          open: true,
          message: 'Неверное имя пользователя или пароль',
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setNotification({
        open: true,
        message: error.response?.data || error.message || 'Произошла ошибка при входе',
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
          Вход
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Typography variant="body2" textAlign="center">
            Еще нет аккаунта? <MuiLink component={RouterLink} to="/register">Зарегистрироваться</MuiLink>
          </Typography>
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

export default LoginPage; 
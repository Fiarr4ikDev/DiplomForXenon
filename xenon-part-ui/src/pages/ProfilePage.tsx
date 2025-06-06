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
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';

interface UpdateUserRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, username, avatarUrl, updateUsername, fetchAndSetAvatar } = useAuth();
  const [usernameInput, setUsernameInput] = useState<string>(username || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.put(`${API_URL}/auth/update`, {
        username: usernameInput,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setNotification({
          open: true,
          message: 'Информация успешно обновлена!',
          severity: 'success'
        });
        if (usernameInput.trim() !== '' && usernameInput.trim() !== username) {
          updateUsername(usernameInput.trim());
        }
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setNotification({
        open: true,
        message: error.response?.data || 'Произошла ошибка при обновлении информации',
        severity: 'error'
      });
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setNotification({
        open: true,
        message: 'Выберите файл для загрузки.',
        severity: 'warning'
      });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await axios.post(`${API_URL}/auth/avatar/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(isAuthenticated && { Authorization: `Bearer ${localStorage.getItem('authToken')}` }),
        },
      });

      if (response.status === 200) {
        setNotification({
          open: true,
          message: 'Аватарка успешно загружена!',
          severity: 'success'
        });
        setAvatarFile(null);
        fetchAndSetAvatar();
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setNotification({
        open: true,
        message: error.response?.data || 'Ошибка при загрузке аватарки',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{
        p: { xs: 3, md: 6 },
        mt: 5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          textAlign="center" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4, 
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: (theme) => `2px 2px 4px ${theme.palette.primary.dark}20`,
            letterSpacing: '1px'
          }}
        >
          Профиль пользователя {username}
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 4, sm: 6 },
          pb: 4,
          borderBottom: '1px dashed',
          borderColor: (theme) => theme.palette.primary.main,
          alignItems: { xs: 'center', sm: 'flex-start' },
        }}>
          <Box sx={{
            flexShrink: 0,
            width: { xs: 120, sm: 150 },
            height: { xs: 150, sm: 180 },
            border: '2px solid',
            borderColor: (theme) => theme.palette.primary.main,
            bgcolor: (theme) => theme.palette.primary.light,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            boxShadow: (theme) => `0 4px 8px ${theme.palette.primary.dark}20`,
          }}>
             <Avatar
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 0,
                objectFit: 'cover',
              }}
              src={avatarUrl || undefined}
              variant="square"
            >
              {!avatarUrl && <PersonIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: (theme) => theme.palette.primary.dark }} />}
            </Avatar>
          </Box>

          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" display="block" gutterBottom sx={{ color: (theme) => theme.palette.primary.main }}>
                Имя пользователя / Username
              </Typography>
              <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: (theme) => theme.palette.primary.dark }}>
                {username || 'Загрузка...'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
           <Typography variant="h6" component="h3" gutterBottom sx={{ 
             borderBottom: '1px solid', 
             borderColor: (theme) => theme.palette.primary.main, 
             pb: 1, 
             mb: 3,
             color: (theme) => theme.palette.primary.main
           }}>
             Обновить данные
           </Typography>

            <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
               <TextField
                 fullWidth
                 label="Новое имя пользователя"
                 value={usernameInput}
                 onChange={(e) => setUsernameInput(e.target.value)}
                 variant="outlined"
                 size="small"
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     '&:hover fieldset': {
                       borderColor: (theme) => theme.palette.primary.main,
                     },
                   },
                 }}
               />
               <TextField
                 fullWidth
                 label="Текущий пароль (для смены имени или пароля)"
                 type="password"
                 value={currentPassword}
                 onChange={(e) => setCurrentPassword(e.target.value)}
                 variant="outlined"
                 size="small"
                 required
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     '&:hover fieldset': {
                       borderColor: (theme) => theme.palette.primary.main,
                     },
                   },
                 }}
               />
               <TextField
                 fullWidth
                 label="Новый пароль (оставьте пустым, если не меняете)"
                 type="password"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 variant="outlined"
                 size="small"
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     '&:hover fieldset': {
                       borderColor: (theme) => theme.palette.primary.main,
                     },
                   },
                 }}
               />
               <Button
                 type="submit"
                 variant="contained"
                 sx={{ 
                   py: 1.5,
                   background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                   '&:hover': {
                     background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                   }
                 }}
               >
                 Сохранить изменения
               </Button>
             </Box>

           <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed', borderColor: (theme) => theme.palette.primary.main }}>
              <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.primary.main }}>
                Загрузить новую аватарку
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                style={{ display: 'block', marginBottom: '16px' }}
              />
              {avatarFile && (
                <Typography variant="body2" sx={{ mt: 1, mb: 2, color: (theme) => theme.palette.primary.main }}>
                  Выбран файл: {avatarFile.name}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={handleAvatarUpload}
                disabled={!avatarFile}
                sx={{ 
                  py: 1,
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  '&:hover': {
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                  }
                }}
              >
                Загрузить аватарку
              </Button>
            </Box>
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

export default ProfilePage; 
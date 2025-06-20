import React, { useState, useEffect } from 'react';
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { keyframes } from '@mui/system';

interface UpdateUserRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
};

// Анимация для справки
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
`;

// Анимация для аватарки
const avatarPop = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
`;

const ProfilePage: React.FC = () => {
  const { isAuthenticated, username, avatarUrl, updateUsername, fetchAndSetAvatar, logout } = useAuth();
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
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(username || '');
  const [editPassword, setEditPassword] = useState('');

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
      const token = localStorage.getItem('authToken');
      console.log('TOKEN FOR AVATAR UPLOAD:', token);
      const response = await axios.post(`${API_URL}/auth/avatar/upload`, formData, {
        headers: {
          ...(isAuthenticated && { Authorization: `Bearer ${token}` }),
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

  useEffect(() => {
    if (avatarFile) {
      handleAvatarUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarFile]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{
        p: 0,
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 480,
        mx: 'auto',
        mt: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        <Box sx={{
          width: '100%',
          py: 5,
          px: 2,
          pb: 7,
          bgcolor: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
          background: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
          color: '#fff',
          textAlign: 'center',
          mb: 0,
        }}>
          <WavingHandIcon sx={{ fontSize: 36, verticalAlign: 'middle', mr: 1 }} />
          <Typography variant="h5" component="span" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {getGreeting()}, {username}!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
            Добро пожаловать в ваш личный кабинет
          </Typography>
        </Box>
        <Box sx={{ mt: -7, mb: 2, position: 'relative', zIndex: 2, animation: `${avatarPop} 0.7s cubic-bezier(.68,-0.55,.27,1.55)` }}>
          <Box sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '5px solid #fff',
            boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25), 0 2px 8px 0 rgba(0,0,0,0.10)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => theme.palette.grey[100],
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
            '&:hover': { transform: 'scale(1.06) rotate(-2deg)' },
          }}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
          onClick={() => avatarInputRef.current?.click()}
          >
            <Avatar
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                bgcolor: (theme) => theme.palette.grey[200],
                transition: 'filter 0.2s',
                filter: avatarHover ? 'brightness(0.7)' : 'none',
              }}
              src={avatarUrl || undefined}
              variant="circular"
            >
              {!avatarUrl && <PersonIcon sx={{ fontSize: 80, color: (theme) => theme.palette.grey[400] }} />}
            </Avatar>
            {avatarHover && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                zIndex: 2,
                pointerEvents: 'none',
                borderRadius: '50%',
              }}>
                <PhotoCameraIcon sx={{ fontSize: 40, mb: 0.5 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 0.5 }}>Обновить аватарку</Typography>
              </Box>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>
        <Typography 
          variant="h4"
          sx={{ 
            fontWeight: 900, 
            mb: 0.5, 
            color: (theme) => theme.palette.primary.main,
            letterSpacing: 0.5
          }}
        >
          {username}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { setEditUsername(username || ''); setEditOpen(true); }}>Редактировать</Button>
          <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={() => setLogoutOpen(true)}>Выйти</Button>
        </Stack>
        <Box sx={{ mt: 3, mb: 1, px: 2, py: 1.5, bgcolor: 'background.default', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, boxShadow: 1, maxWidth: 340, mx: 'auto', animation: `${fadeInUp} 0.7s 0.2s both` }}>
          <InfoOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="body2" color="text.secondary">
            В профиле вы можете изменить имя пользователя, загрузить аватарку и выйти из системы.
          </Typography>
        </Box>
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Редактировать профиль</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Новое имя пользователя"
            value={editUsername}
            onChange={e => setEditUsername(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Текущий пароль"
            type="password"
            value={editPassword}
            onChange={e => setEditPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={async () => {
            try {
              const response = await axios.put(`${API_URL}/auth/update`, {
                username: editUsername,
                currentPassword: editPassword,
                newPassword: '',
              }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
              });
              if (response.status === 200) {
                updateUsername(editUsername);
                setNotification({ open: true, message: 'Имя пользователя обновлено!', severity: 'success' });
                setEditOpen(false);
              }
            } catch (error: any) {
              setNotification({ open: true, message: error.response?.data || 'Ошибка при обновлении', severity: 'error' });
            }
          }}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Выйти из аккаунта?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Отмена</Button>
          <Button variant="contained" color="error" onClick={() => { logout(); setLogoutOpen(false); }}>Выйти</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage; 
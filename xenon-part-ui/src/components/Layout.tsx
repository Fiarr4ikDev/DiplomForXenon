import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
  MenuItem,
  Menu,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { settings } = useSettings();
  const { isAuthenticated, username, avatarUrl, logout } = useAuth();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Категории', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Поставщики', icon: <LocalShippingIcon />, path: '/suppliers' },
    { text: 'Запчасти', icon: <BuildIcon />, path: '/parts' },
    { text: 'Остатки', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Конфигурация', icon: <TuneIcon />, path: '/configuration' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: '1.5rem'
        }}>
          Ксенон+
        </Typography>
      </Box>
      {isAuthenticated ? (
        <List sx={{ overflowX: 'hidden', flexGrow: 1 }}>
          {menuItems.map((item) => (
              <ListItem
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={() => isMobile && handleDrawerToggle()}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    color: (theme) => theme.palette.primary.main,
                    fontWeight: 'bold',
                    '& .MuiListItemText-primary': {
                      color: (theme) => theme.palette.primary.main,
                      fontWeight: 'bold',
                    }
                  }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
          ))}

          <ListItem
            component={RouterLink}
            to="/profile"
            sx={{
              mt: 'auto',
              borderTop: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 24,
                  height: 24,
                }}
                src={avatarUrl || undefined}
              >
                {!avatarUrl && <PersonIcon fontSize="small" />}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Box component="span" sx={{ fontWeight: 900, color: (theme) => theme.palette.primary.main }}>
                  {username || 'Пользователь'}
                </Box>
              }
            />
          </ListItem>

        </List>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Сначала войдите в аккаунт
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            onClick={() => isMobile && handleDrawerToggle()}
          >
            Войти
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Система управления запчастями
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {isAuthenticated || isAuthPage ? (
          children
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}
      </Box>
    </Box>
  );
};

export default Layout; 
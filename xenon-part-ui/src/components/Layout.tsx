import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { settings } = useSettings();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Категории', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Поставщики', icon: <LocalShippingIcon />, path: '/suppliers' },
    { text: 'Запчасти', icon: <BuildIcon />, path: '/parts' },
    { text: 'Инвентарь', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Конфигурация', icon: <TuneIcon />, path: '/configuration' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
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
      <List sx={{ overflowX: 'hidden' }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
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
              overflowX: 'hidden'
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
        }}
      >
        {children}

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2, // padding top and bottom
            px: 3, // padding left and right
            mt: 'auto', // push to bottom
            backgroundColor: theme.palette.primary.dark, // dark primary color background
            color: theme.palette.primary.contrastText, // white text
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Система управления запчастей "Ксенон+". Все права защищены.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 
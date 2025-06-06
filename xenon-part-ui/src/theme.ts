import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark', primaryColor: string, settings: any): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: primaryColor || '#1976d2',
      light: primaryColor || '#42a5f5',
      dark: primaryColor || '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#f48fb1',
      light: mode === 'light' ? '#ff4081' : '#f8bbd0',
      dark: mode === 'light' ? '#9a0036' : '#c2185b',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
          '&:hover': settings.animations ? {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          } : {},
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(224, 224, 224, 1)' : 'rgba(81, 81, 81, 1)'}`,
          padding: settings.density === 'compact' ? '8px 16px' : 
                  settings.density === 'spacious' ? '24px 32px' : '16px 24px',
          transition: settings.animations ? 'all 0.2s ease-in-out' : 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? (primaryColor || '#1976d2') : '#1e1e1e',
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: settings.animations ? 'all 0.2s ease-in-out' : 'none',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            transform: settings.animations ? 'translateX(8px)' : 'none',
          },
          padding: settings.density === 'compact' ? '8px 16px' : 
                  settings.density === 'spacious' ? '24px 32px' : '16px 24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
          '&:hover': settings.animations ? {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          } : {},
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
          '&:hover': settings.animations ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          } : {},
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: settings.roundedCorners ? undefined : 0,
          transition: settings.animations ? 'all 0.3s ease-in-out' : 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: settings.animations ? 'all 0.2s ease-in-out' : 'none',
          '&:hover': settings.animations ? {
            transform: 'scale(1.1) rotate(5deg)',
          } : {},
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: settings.animations ? 'all 0.2s ease-in-out' : 'none',
          '&:hover': settings.animations ? {
            transform: 'scale(1.05)',
          } : {},
        },
      },
    },
  },
  typography: {
    fontSize: settings.fontSize,
    button: {
      textTransform: 'none',
    },
  },
});

export const getTheme = (mode: 'light' | 'dark', primaryColor: string, settings: any) => 
  createTheme(getThemeOptions(mode, primaryColor, settings)); 
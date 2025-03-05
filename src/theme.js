// theme.js
import { createTheme } from '@mui/material/styles';
import './index.css'; // or './App.css'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A73E8', // Google-like blue
    },
    secondary: {
      main: '#E37400',
    },
    background: {
      default: '#F8F9FA', // very light gray
      paper: '#FFFFFF',   // white for cards
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'Helvetica',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#202124',
          boxShadow: 'none',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // Optionally override Paper's default elevation
          // boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

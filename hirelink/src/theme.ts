import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo-600: A modern, trustworthy blue-purple
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981', // Emerald-500: Fresh green for success states
    },
    background: {
      default: '#F3F4F6', // Light gray background (not harsh white)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Gray-900: Softer than pure black
      secondary: '#6B7280', // Gray-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }, // No ALL CAPS buttons
  },
  shape: {
    borderRadius: 12, // More rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          padding: '10px 24px',
          '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #4F46E5 30%, #6366F1 90%)', // subtle gradient
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }, // Fixes dark mode weirdness if enabled
        elevation1: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
        elevation3: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
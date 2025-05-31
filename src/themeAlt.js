import { createTheme } from '@mui/material/styles';

const themeAlt = createTheme({
  palette: {
    primary: {
      main: '#00897B', // Teal
      light: '#4DB6AC',
      dark: '#004D40',
    },
    secondary: {
      main: '#FF5722', // Deep Orange
      light: '#FF8A65',
      dark: '#D84315',
    },
    background: {
      default: '#ECEFF1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFA726',
    },
    success: {
      main: '#66BB6A',
    },
    info: {
      main: '#29B6F6',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
      color: '#263238',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      color: '#263238',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#263238',
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      color: '#546E7A',
      lineHeight: 1.75,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover fieldset': {
              borderColor: '#00897B',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

export default themeAlt; 
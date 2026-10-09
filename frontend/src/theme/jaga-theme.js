import { createTheme } from '@mui/material/styles'

// JAGA Intelligence System Material UI Theme (from DESIGN.md)
export const jagaTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#080B24',
      paper: '#0D1130',
    },
    primary: {
      main: '#35F2A0', // Signal Green
      light: '#8BFFCE',
      dark: '#006a42',
      contrastText: '#080B24',
    },
    secondary: {
      main: '#c1c4ec',
      dark: '#414466',
    },
    error: {
      main: '#FF5C67', // Critical Fraud Alert
      light: '#ffb4ab',
      dark: '#93000a',
    },
    warning: {
      main: '#FF9F43', // High Risk
    },
    info: {
      main: '#FFD166', // Medium Risk / Warning
    },
    surface: {
      main: '#080B24',
      low: '#0D1130',
      container: '#131735',
      high: '#1C2248',
      highest: '#283060',
    },
    text: {
      primary: '#dfe0ff',
      secondary: '#9ca7c5',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "JetBrains Mono", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
    },
    caption: {
      fontFamily: '"JetBrains Mono", monospace',
    },
    overline: {
      fontFamily: '"JetBrains Mono", monospace',
      letterSpacing: '0.06em',
    },
  },
  shape: {
    borderRadius: 4, // 0.25rem / 4px base
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D1130',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default jagaTheme

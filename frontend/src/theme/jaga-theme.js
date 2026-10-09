import { createTheme } from '@mui/material/styles'

// JAGA Intelligence System Material UI Theme (from DESIGN.md)
export const getJagaTheme = (mode = 'dark') => {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        default: isDark ? '#080B24' : '#F4F6FB',
        paper: isDark ? '#0D1130' : '#FFFFFF',
      },
      primary: {
        main: isDark ? '#35F2A0' : '#0B945B', // Signal Green vs Accessible Deep Forest Emerald
        light: isDark ? '#8BFFCE' : '#2CD987',
        dark: '#006a42',
        contrastText: isDark ? '#080B24' : '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#c1c4ec' : '#3E497A',
        dark: '#2A3359',
      },
      error: {
        main: isDark ? '#FF5C67' : '#D92D38', // Critical Fraud Alert
        light: '#ffb4ab',
        dark: '#93000a',
      },
      warning: {
        main: isDark ? '#FF9F43' : '#D97706', // High Risk
      },
      info: {
        main: isDark ? '#FFD166' : '#B45309', // Medium Risk / Warning
      },
      surface: {
        main: isDark ? '#080B24' : '#F4F6FB',
        low: isDark ? '#0D1130' : '#FFFFFF',
        container: isDark ? '#131735' : '#E8ECF5',
        high: isDark ? '#1C2248' : '#DCE2F0',
        highest: isDark ? '#283060' : '#CCD5E8',
      },
      text: {
        primary: isDark ? '#dfe0ff' : '#0F172A',
        secondary: isDark ? '#9ca7c5' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
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
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#080B24' : '#F4F6FB',
            color: isDark ? '#dfe0ff' : '#0F172A',
          },
        },
      },
    },
  })
}

export const jagaTheme = getJagaTheme('dark')
export default jagaTheme

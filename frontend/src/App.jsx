import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, useJagaTheme } from './context/ThemeContext'
import { getJagaTheme } from './theme/jaga-theme'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Investigation from './pages/Investigation'
import NetworkDetail from './pages/NetworkDetail'
import Analytics from './pages/Analytics'
import History from './pages/History'
import './App.css'

function AppContent() {
  const { theme } = useJagaTheme()
  const muiTheme = getJagaTheme(theme)

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigation" element={<Investigation />} />
            <Route path="/network/:id" element={<NetworkDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </Router>
    </MuiThemeProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App

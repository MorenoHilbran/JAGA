import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import jagaTheme from './theme/jaga-theme'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import NetworkDetail from './pages/NetworkDetail'
import Analytics from './pages/Analytics'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={jagaTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/network/:id" element={<NetworkDetail />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

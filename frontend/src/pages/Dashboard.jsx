import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getRiskNetworks } from '../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [networks, setNetworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNetworks()
  }, [])

  const loadNetworks = async () => {
    try {
      setLoading(true)
      // TODO: Implement API call
      // const data = await getRiskNetworks()
      // setNetworks(data)
      
      // Mock data for now
      setNetworks([
        {
          network_id: 'NET001',
          risk_score: 87,
          risk_category: 'CRITICAL',
          primary_risk_type: 'Referral Concentration',
          total_claim_amount: 15000000,
          entity_count: 42,
          detected_at: '2026-10-01',
        },
        {
          network_id: 'NET002',
          risk_score: 72,
          risk_category: 'HIGH',
          primary_risk_type: 'Cloning Pattern',
          total_claim_amount: 8500000,
          entity_count: 28,
          detected_at: '2026-10-01',
        },
      ])
    } catch (error) {
      console.error('Error loading networks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (category) => {
    const colors = {
      CRITICAL: 'error',
      HIGH: 'warning',
      MEDIUM: 'info',
      LOW: 'success',
    }
    return colors[category] || 'default'
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Investigation Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Networks
              </Typography>
              <Typography variant="h4">{networks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Critical Risk
              </Typography>
              <Typography variant="h4" color="error">
                {networks.filter(n => n.risk_category === 'CRITICAL').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount at Risk
              </Typography>
              <Typography variant="h6">
                Rp {(networks.reduce((sum, n) => sum + n.total_claim_amount, 0) / 1000000).toFixed(1)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h4">{networks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Priority Queue Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Priority Investigation Queue
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Network ID</TableCell>
                <TableCell>Risk Score</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Risk Type</TableCell>
                <TableCell>Entities</TableCell>
                <TableCell align="right">Amount at Risk</TableCell>
                <TableCell>Detected</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : networks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No networks to investigate
                  </TableCell>
                </TableRow>
              ) : (
                networks.map((network) => (
                  <TableRow key={network.network_id} hover>
                    <TableCell>{network.network_id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {network.risk_score}
                        </Typography>
                        <Box
                          sx={{
                            width: 60,
                            height: 8,
                            bgcolor: 'grey.300',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${network.risk_score}%`,
                              height: '100%',
                              bgcolor: network.risk_score >= 80 ? 'error.main' : network.risk_score >= 60 ? 'warning.main' : 'info.main',
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={network.risk_category}
                        color={getRiskColor(network.risk_category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{network.primary_risk_type}</TableCell>
                    <TableCell>{network.entity_count}</TableCell>
                    <TableCell align="right">
                      Rp {(network.total_claim_amount / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell>{network.detected_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/network/${network.network_id}`)}
                      >
                        Investigate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default Dashboard

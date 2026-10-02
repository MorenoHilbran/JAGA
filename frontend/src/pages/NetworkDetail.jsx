import { useParams } from 'react-router-dom'
import { Box, Paper, Typography, Chip, Grid, Card, CardContent, Tabs, Tab } from '@mui/material'
import { useState } from 'react'

const NetworkDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState(0)

  // Mock data - will be replaced with API call
  const network = {
    network_id: id,
    risk_score: 87,
    risk_category: 'CRITICAL',
    primary_risk_type: 'Referral Concentration',
    explanation: 'This network exhibits three concerning patterns: (1) Dr. Ahmad, Dr. Budi, and Dr. Siti refer 82% of their patients to Hospital X, compared to 34% peer average. (2) Claims from 42 patients show 87% similarity in diagnosis codes, procedure codes, and claim amounts.',
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Network Detail: {id}
      </Typography>

      {/* Network Summary Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Risk Assessment
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Typography variant="h3" color="error">
                {network.risk_score}
              </Typography>
              <Box>
                <Chip label={network.risk_category} color="error" sx={{ mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  {network.primary_risk_type}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" paragraph>
              {network.explanation}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Key Metrics
                </Typography>
                <Typography variant="body2">Entities: 42</Typography>
                <Typography variant="body2">Claims: 156</Typography>
                <Typography variant="body2">Amount: Rp 15.0M</Typography>
                <Typography variant="body2">Period: 30 days</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Overview" />
          <Tab label="Network Visualization" />
          <Tab label="Claims" />
          <Tab label="Timeline" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Typography>Network overview content - TODO: Implement</Typography>
          )}
          {activeTab === 1 && (
            <Typography>Network visualization (Cytoscape.js) - TODO: Implement</Typography>
          )}
          {activeTab === 2 && (
            <Typography>Claims table - TODO: Implement</Typography>
          )}
          {activeTab === 3 && (
            <Typography>Timeline visualization - TODO: Implement</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default NetworkDetail

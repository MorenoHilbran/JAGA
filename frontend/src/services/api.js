/**
 * API Service for JAGA Backend
 * Handles all HTTP requests to the FastAPI backend
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API Endpoints

/**
 * Get list of risk networks
 */
export const getRiskNetworks = async (params = {}) => {
  const response = await api.get('/api/networks', { params })
  return response.data
}

/**
 * Get network details by ID
 */
export const getNetworkDetail = async (networkId) => {
  const response = await api.get(`/api/networks/${networkId}`)
  return response.data
}

/**
 * Get claims for a network
 */
export const getNetworkClaims = async (networkId) => {
  const response = await api.get(`/api/networks/${networkId}/claims`)
  return response.data
}

/**
 * Get graph data for visualization
 */
export const getGraphData = async (networkId) => {
  const response = await api.get(`/api/graph/query`, {
    params: { network_id: networkId }
  })
  return response.data
}

/**
 * Submit investigation decision
 */
export const submitInvestigationDecision = async (networkId, decision) => {
  const response = await api.post('/api/investigation/decision', {
    network_id: networkId,
    ...decision
  })
  return response.data
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await api.get('/api/stats/summary')
  return response.data
}

export default api

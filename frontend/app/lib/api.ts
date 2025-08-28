import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Equipment API
export const equipmentApi = {
  getAll: () => api.get('/equipment/'),
  getById: (id: string) => api.get(`/equipment/${id}`),
  getWithStatus: () => api.get('/equipment/status/detailed'),
  create: (data: any) => api.post('/equipment/', data),
  update: (id: string, data: any) => api.put(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
}

// Sites API
export const sitesApi = {
  getAll: () => api.get('/sites/'),
  getById: (id: string) => api.get(`/sites/${id}`),
  create: (data: any) => api.post('/sites/', data),
  update: (id: string, data: any) => api.put(`/sites/${id}`, data),
  delete: (id: string) => api.delete(`/sites/${id}`),
}

// Operators API
export const operatorsApi = {
  getAll: () => api.get('/operators/'),
  getById: (id: string) => api.get(`/operators/${id}`),
  create: (data: any) => api.post('/operators/', data),
  update: (id: string, data: any) => api.put(`/operators/${id}`, data),
  delete: (id: string) => api.delete(`/operators/${id}`),
}

// ML API
export const mlApi = {
  getStatus: () => api.get('/ml/status'),
  getHealth: () => api.get('/ml/health'),
  
  // Demand Forecasting
  forecastDemand: (params: { equipment_type?: string; site_id?: string; days_ahead?: number }) =>
    api.post('/ml/demand-forecast', params),
  forecastBulkDemand: (days_ahead: number = 7) =>
    api.post('/ml/demand-forecast/bulk', { days_ahead }),
  
  // Anomaly Detection
  detectAnomalies: (equipment_id?: string) =>
    api.post('/ml/anomaly-detection', { equipment_id }),
  getAnomalySummary: () => api.get('/ml/anomaly-detection/summary'),
  
  // Analytics
  getEquipmentStats: () => api.get('/ml/analytics/equipment-stats'),
  getRecommendations: () => api.get('/ml/analytics/recommendations'),
  getEquipmentPerformance: (equipment_type: string) =>
    api.get(`/ml/analytics/equipment/${equipment_type}/performance`),
  getSiteUtilization: (site_id: string) =>
    api.get(`/ml/analytics/site/${site_id}/utilization`),
  
  // Model Management
  saveModels: () => api.post('/ml/models/save'),
  retrainModels: () => api.post('/ml/models/retrain'),
}

// Dashboard API
export const fetchDashboardData = async () => {
  try {
    // Use the new dashboard endpoint that provides mock data
    const response = await api.get('/dashboard')
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      overview: {
        total_equipment: 0,
        active_rentals: 0,
        anomalies: 0,
        utilization_rate: 0,
      },
      equipment_stats: null,
      anomalies: null,
      recommendations: null,
    }
  }
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.response?.status === 401) {
      // Handle unauthorized
    } else if (error.response?.status === 500) {
      // Handle server error
    }
    return Promise.reject(error)
  }
)

export default api

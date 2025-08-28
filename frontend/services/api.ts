import axios from 'axios';

// API base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on backend schemas
export interface Equipment {
  id: number;
  equipment_id: string;
  type: string;
  model: string;
  site_id: number;
  status: string;
  last_maintenance: string;
  next_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentCreate {
  equipment_id: string;
  type: string;
  model: string;
  site_id: number;
  status: string;
  last_maintenance: string;
  next_maintenance: string;
}

export interface EquipmentUpdate {
  type?: string;
  model?: string;
  site_id?: number;
  status?: string;
  last_maintenance?: string;
  next_maintenance?: string;
}

export interface Site {
  id: number;
  site_id: string;
  name: string;
  location: string;
  contact_person: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface SiteCreate {
  site_id: string;
  name: string;
  location: string;
  contact_person: string;
  contact_phone: string;
}

export interface Operator {
  id: number;
  operator_id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  created_at: string;
  updated_at: string;
}

export interface OperatorCreate {
  operator_id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
}

export interface Rental {
  id: number;
  equipment_id: number;
  operator_id: number;
  site_id: number;
  start_date: string;
  end_date: string;
  status: string;
  daily_rate: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface RentalCreate {
  equipment_id: number;
  operator_id: number;
  site_id: number;
  start_date: string;
  end_date: string;
  daily_rate: number;
}

export interface RentalUpdate {
  end_date?: string;
  status?: string;
  daily_rate?: number;
  total_cost?: number;
}

export interface UsageLog {
  id: number;
  rental_id: number;
  equipment_id: number;
  operator_id: number;
  site_id: number;
  usage_hours: number;
  fuel_consumption: number;
  maintenance_notes: string;
  created_at: string;
}

export interface UsageLogCreate {
  rental_id: number;
  equipment_id: number;
  operator_id: number;
  site_id: number;
  usage_hours: number;
  fuel_consumption: number;
  maintenance_notes: string;
}

export interface Alert {
  id: number;
  equipment_id: number;
  alert_type: string;
  message: string;
  severity: string;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface AlertCreate {
  equipment_id: number;
  alert_type: string;
  message: string;
  severity: string;
}

export interface DashboardSummary {
  equipment_summary: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
  };
  rental_summary: {
    active: number;
    overdue: number;
    completed: number;
  };
  recent_alerts: Alert[];
}

// Equipment API calls
export const equipmentAPI = {
  create: (data: EquipmentCreate) => api.post<Equipment>('/equipment/', data),
  getAll: (skip = 0, limit = 100) => api.get<Equipment[]>(`/equipment/?skip=${skip}&limit=${limit}`),
  getById: (id: number) => api.get<Equipment>(`/equipment/${id}`),
  update: (id: number, data: EquipmentUpdate) => api.put<Equipment>(`/equipment/${id}`, data),
  getWithStatus: (skip = 0, limit = 100) => api.get(`/equipment/status/detailed?skip=${skip}&limit=${limit}`),
};

// Site API calls
export const siteAPI = {
  create: (data: SiteCreate) => api.post<Site>('/sites/', data),
  getAll: (skip = 0, limit = 100) => api.get<Site[]>(`/sites/?skip=${skip}&limit=${limit}`),
  getById: (id: number) => api.get<Site>(`/sites/${id}`),
  update: (id: number, data: Partial<SiteCreate>) => api.put<Site>(`/sites/${id}`, data),
};

// Operator API calls
export const operatorAPI = {
  create: (data: OperatorCreate) => api.post<Operator>('/operators/', data),
  getAll: (skip = 0, limit = 100) => api.get<Operator[]>(`/operators/?skip=${skip}&limit=${limit}`),
  getById: (id: number) => api.get<Operator>(`/operators/${id}`),
  update: (id: number, data: Partial<OperatorCreate>) => api.put<Operator>(`/operators/${id}`, data),
};

// Rental API calls
export const rentalAPI = {
  create: (data: RentalCreate) => api.post<Rental>('/rentals/', data),
  createManual: (data: RentalCreate) => api.post<Rental>('/rentals/manual', data),
  getAll: (skip = 0, limit = 100, status?: string) => {
    const params = new URLSearchParams();
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    return api.get<Rental[]>(`/rentals/?${params.toString()}`);
  },
  getActive: () => api.get<Rental[]>('/rentals/active'),
  getOverdue: () => api.get<Rental[]>('/rentals/overdue'),
  getById: (id: number) => api.get<Rental>(`/rentals/${id}`),
  update: (id: number, data: RentalUpdate) => api.put<Rental>(`/rentals/${id}`, data),
  checkIn: (id: number) => api.post<Rental>(`/rentals/${id}/checkin`),
};

// Usage Log API calls
export const usageLogAPI = {
  create: (data: UsageLogCreate) => api.post<UsageLog>('/usage-logs/', data),
  getByRental: (rentalId: number) => api.get<UsageLog[]>(`/usage-logs/rental/${rentalId}`),
  getByEquipment: (equipmentId: number) => api.get<UsageLog[]>(`/usage-logs/equipment/${equipmentId}`),
};

// Alert API calls
export const alertAPI = {
  create: (data: AlertCreate) => api.post<Alert>('/alerts/', data),
  getAll: (skip = 0, limit = 100, isResolved?: boolean) => {
    const params = new URLSearchParams();
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());
    if (isResolved !== undefined) params.append('is_resolved', isResolved.toString());
    return api.get<Alert[]>(`/alerts/?${params.toString()}`);
  },
  resolve: (id: number, resolvedBy: string) => api.put(`/alerts/${id}/resolve`, { resolved_by: resolvedBy }),
};

// Dashboard API calls
export const dashboardAPI = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
  detectAnomalies: () => api.post('/analytics/detect-anomalies'),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

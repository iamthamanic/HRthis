/**
 * HR API Service
 * Handles all API communication with the HRthis backend
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Employee API
export const employeeAPI = {
  // Get all employees with filters
  getEmployees: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    
    const response = await apiClient.get(`/api/employees/?${params}`);
    return response.data;
  },

  // Get employee by ID
  getEmployee: async (id: string) => {
    const response = await apiClient.get(`/api/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData: any) => {
    const response = await apiClient.post('/api/employees/', employeeData);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, employeeData: any) => {
    const response = await apiClient.patch(`/api/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee (soft delete)
  deleteEmployee: async (id: string) => {
    await apiClient.delete(`/api/employees/${id}`);
  },

  // Send onboarding email
  sendOnboardingEmail: async (id: string, preset: string) => {
    const response = await apiClient.post(`/api/employees/${id}/send-onboarding-email`, {
      preset
    });
    return response.data;
  },

  // Get onboarding status
  getOnboardingStatus: async (id: string) => {
    const response = await apiClient.get(`/api/employees/${id}/onboarding-status`);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await apiClient.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    // Could call backend logout endpoint if needed
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};

// File Upload API
export const fileAPI = {
  uploadFile: async (file: File, category?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);

    const response = await apiClient.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFile: async (fileId: string) => {
    const response = await apiClient.get(`/api/files/${fileId}`);
    return response.data;
  },

  deleteFile: async (fileId: string) => {
    await apiClient.delete(`/api/files/${fileId}`);
  }
};

export { apiClient };
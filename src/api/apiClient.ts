import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8050',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      // Redirect to login or handle reauth
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
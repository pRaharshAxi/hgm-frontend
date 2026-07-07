import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

// Response interceptor: handle 401 -> redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // clear auth and redirect
      try {
        useAuthStore.getState().logout();
      } catch (e) {
        // fallback
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

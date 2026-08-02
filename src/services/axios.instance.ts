import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        useAuthStore.getState().logout();
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

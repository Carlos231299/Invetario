import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores de red
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      error.networkError = true;
      error.message = 'Error de conexión. Verifica que el servidor esté disponible.';
    }
    
    // Manejo de timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.timeoutError = true;
      error.message = 'Tiempo de espera agotado. Por favor, intenta nuevamente.';
    }
    
    // Manejo de 401 (no autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;


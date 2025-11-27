import api from './api.js';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      // Manejo de errores de conexión
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      // Manejo de errores de respuesta del servidor
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error al iniciar sesión'
        };
      }
      // Error desconocido
      return {
        success: false,
        message: 'Error inesperado. Por favor, intenta nuevamente.'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al solicitar recuperación de contraseña'
      };
    }
  },

  verifyCode: async (email, code) => {
    try {
      const response = await api.post('/auth/verify-code', { email, code });
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar código'
      };
    }
  },

  resetPassword: async (email, code, password) => {
    try {
      const response = await api.post('/auth/reset-password', { email, code, password });
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer contraseña'
      };
    }
  },

  resetPasswordByToken: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer contraseña'
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté disponible.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  }
};


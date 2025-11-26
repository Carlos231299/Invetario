import api from './api.js';

export const movementService = {
  getAll: (filters = {}) => api.get('/movements', { params: filters })
};


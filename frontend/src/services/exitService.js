import api from './api.js';

export const exitService = {
  getAll: (filters = {}) => api.get('/exits', { params: filters }),
  getById: (id) => api.get(`/exits/${id}`),
  create: (data) => api.post('/exits', data)
};


import api from './api.js';

export const entryService = {
  getAll: (filters = {}) => api.get('/entries', { params: filters }),
  getById: (id) => api.get(`/entries/${id}`),
  create: (data) => api.post('/entries', data)
};


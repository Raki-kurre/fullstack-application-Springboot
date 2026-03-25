import api from './api';

export const productService = {
  /** Get all products (optionally filtered by search term) */
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await api.get('/products', { params });
    return res.data.data;
  },

  /** Get single product by id */
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  /** Create product (ADMIN only) */
  create: async (data) => {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  /** Update product (ADMIN only) */
  update: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  /** Delete product (ADMIN only) */
  delete: async (id) => {
    await api.delete(`/products/${id}`);
  },
};

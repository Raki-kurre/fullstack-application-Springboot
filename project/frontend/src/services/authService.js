import api from './api';

export const authService = {
  /** Register new user */
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data.data; // AuthResponse
  },

  /** Login with email + password */
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data.data; // AuthResponse
  },

  /** Fetch current user profile */
  getProfile: async () => {
    const res = await api.get('/users/me');
    return res.data.data; // UserResponse
  },

  /** Update profile */
  updateProfile: async (data) => {
    const res = await api.put('/users/me', data);
    return res.data.data;
  },

  /** Change password */
  changePassword: async (data) => {
    const res = await api.put('/users/me/password', data);
    return res.data;
  },
};

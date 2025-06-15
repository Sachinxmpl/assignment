import type { User } from '../types';
import api from './api';

export const authApi = {
    login: async (email: string, password: string) => {
      const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
      return response.data;
    },
    register: async (email: string, password: string, name: string) => {
      const response = await api.post<{ user: User; token: string }>('/auth/register', { email, password, name });
      return response.data;
    },
    getCurrentUser: async () => {
      const response = await api.get<User>('/auth/me');
      return response.data;
    },
    googleLogin: () => {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    },
  };
import api from './api';
import type  { User } from '../types';

export const userApi = {
  getUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  updateUser: async (id: number, data: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
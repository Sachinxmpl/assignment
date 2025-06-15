import api from './api';
import type { Borrow } from '../types';

export const borrowApi = {
  borrowBook: async (bookId: number) => {
    const response = await api.post<Borrow>('/borrows', { bookId });
    return response.data;
  },
  returnBook: async (borrowId: number) => {
    const response = await api.post(`/borrows/return/${borrowId}`);
    return response.data;
  },
  getBorrowHistory: async () => {
    const response = await api.get<Borrow[]>('/borrows/history');
    return response.data;
  },
};
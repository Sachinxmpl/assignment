import api from './api';
import type { Book} from '../types';

export const bookApi = {
  getBooks: async (filters: {
    category?: number | string;
    author?: string;
    rating?: number;
    availability?: string;
    sortBy?: string;
  }) => {
    const response = await api.get<Book[]>('/books', { params: filters });
    return response.data;
  },

  getBookById: async (id: number) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  createBook: async (data: FormData) => {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  updateBook: async (id: number, data: FormData) => {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: number) => {
    await api.delete(`/books/${id}`);
  },

  createReview: async (data: { bookId: number; rating: number; comment?: string }) => {
    console.log("Inside bookapi")
    console.log(data)
    const response = await api.post('/reviews', data);
    return response.data;
  },

  bookmarkBook: async (bookId: number) => {
    const response = await api.post('/bookmarks', { bookId });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  }
};

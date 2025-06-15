import { useState, useEffect } from 'react';
import { bookApi } from '../services/bookApi';
import type { Book } from '../types';
import { toast } from 'react-toastify';

export const useBooks = (filters: {
  category?: string;
  author?: string;
  rating?: number;
  availability?: string;
  sortBy?: string;
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    bookApi.getBooks(filters)
      .then(data => setBooks(data))
      .catch(() => toast.error('Failed to fetch books'))
      .finally(() => setLoading(false));
  }, [filters]);

  return { books, loading };
};
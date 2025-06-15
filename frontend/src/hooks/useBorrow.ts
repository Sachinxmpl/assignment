import { useState } from 'react';
import { toast } from 'react-toastify';
import { borrowApi } from '../services/borrowApi';

export const useBorrow = () => {
  const [loading, setLoading] = useState(false);

  const borrowBook = async (bookId: number) => {
    setLoading(true);
    try {
      await borrowApi.borrowBook(bookId);
      toast.success('Book borrowed successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (borrowId: number) => {
    setLoading(true);
    try {
      await borrowApi.returnBook(borrowId);
      toast.success('Book returned successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  return { borrowBook, returnBook, loading };
};
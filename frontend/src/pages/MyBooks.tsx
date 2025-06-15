import { useEffect, useState } from 'react';
import { borrowApi } from '../services/borrowApi';
import type { Borrow } from '../types';
import { useBorrow } from '../hooks/useBorrow';
import { toast } from 'react-toastify';

export const MyBooks = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const { returnBook, loading } = useBorrow();

  useEffect(() => {
    borrowApi.getBorrowHistory()
      .then(setBorrows)
      .catch(() => toast.error('Failed to fetch borrowed books'));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Borrowed Books</h1>
      <div className="space-y-4">
        {borrows.map(borrow => (
          <div key={borrow.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p><strong>{borrow.book.title}</strong> by {borrow.book.author}</p>
              <p>Borrowed on: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
              <p>Due on: {new Date(borrow.dueDate).toLocaleDateString()}</p>
              {borrow.returnDate ? (
                <p>Returned on: {new Date(borrow.returnDate).toLocaleDateString()}</p>
              ) : (
                <p>Fine: ${borrow.fine}</p>
              )}
            </div>
            {!borrow.returnDate && (
              <button
                onClick={() => returnBook(borrow.id).then(() => borrowApi.getBorrowHistory().then(setBorrows))}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
              >
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
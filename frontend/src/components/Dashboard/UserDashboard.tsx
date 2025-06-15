import { useEffect, useState } from 'react';

import type { Borrow } from '../../types';
import { toast } from 'react-toastify';
import { borrowApi } from '../../services/borrowApi';

export const UserDashboard = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    borrowApi.getBorrowHistory().then(setBorrows).catch(() => toast.error('Failed to fetch borrows'));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">My Borrowed Books</h2>
      <div className="space-y-4">
        {borrows.map(borrow => (
          <div key={borrow.id} className="border rounded p-4">
            <p><strong>{borrow.book.title}</strong> by {borrow.book.author}</p>
            <p>Borrowed on: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
            <p>Due on: {new Date(borrow.dueDate).toLocaleDateString()}</p>
            {borrow.returnDate ? (
              <p>Returned on: {new Date(borrow.returnDate).toLocaleDateString()}</p>
            ) : (
              <p>Fine: ${borrow.fine}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
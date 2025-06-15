import { useState, useEffect } from 'react';
import { bookApi } from '../../services/bookApi';
import type { Book, User, Borrow } from '../../types';
import { toast } from 'react-toastify';
import { borrowApi } from '../../services/borrowApi';
import { userApi } from '../../services/userApi';

export const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    bookApi.getBooks({}).then(setBooks).catch(() => toast.error('Failed to fetch books'));
    userApi.getUsers().then(setUsers).catch(() => toast.error('Failed to fetch users'));
    borrowApi.getBorrowHistory().then(setBorrows).catch(() => toast.error('Failed to fetch borrows'));
  }, []);

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await bookApi.createBook(formData);
      toast.success('Book added successfully');
      bookApi.getBooks({}).then(setBooks);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Books</h2>
          <p className="text-2xl">{books.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Active Users</h2>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Overdue Borrows</h2>
          <p className="text-2xl">{borrows.filter(b => new Date(b.dueDate) < new Date() && !b.returnDate).length}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <input type="text" name="title" placeholder="Title" className="w-full border rounded p-2" required />
          <input type="text" name="author" placeholder="Author" className="w-full border rounded p-2" required />
          <textarea name="description" placeholder="Description" className="w-full border rounded p-2" required />
          <input type="number" name="categoryId" placeholder="Category ID" className="w-full border rounded p-2" required />
          <input type="number" name="totalCopies" placeholder="Total Copies" className="w-full border rounded p-2" required />
          <input type="file" name="coverImage" accept="image/*" className="w-full" required />
          <input type="file" name="ebookFile" accept=".pdf" className="w-full" required />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Book</button>
        </form>
      </div>
    </div>
  );
};
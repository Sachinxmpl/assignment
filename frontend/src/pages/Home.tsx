import { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { bookApi } from '../services/bookApi';
import type  { Book } from '../types';
import { toast } from 'react-toastify';

export const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    rating: undefined as number | undefined,
    availability: '',
    sortBy: '',
  });

  useEffect(() => {
    bookApi.getBooks(filters).then(setBooks).catch(() => toast.error('Failed to fetch books'));
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ebook Library</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by author"
          value={filters.author}
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          className="border rounded p-2"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {/* Fetch categories dynamically */}
        </select>
        <select
          value={filters.rating ?? ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              rating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="border rounded p-2"
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}+</option>
          ))}
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
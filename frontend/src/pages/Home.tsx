import { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { bookApi } from '../services/bookApi';
import type { Book } from '../types';
import { toast } from 'react-toastify';
import { Search, Filter, BookOpen } from 'lucide-react';

export const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    category: '' as number | '',
    author: '',
    rating: undefined as number | undefined,
    availability: '',
    sortBy: '',
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const fetchedBooks = await bookApi.getBooks(filters);
        setBooks(fetchedBooks);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await bookApi.getCategories();
        console.log(res)
        setCategories(res || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };


    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      rating: undefined,
      availability: '',
      sortBy: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center">
              <Filter size={20} className="mr-2" />
              Filter & Search
            </h2>
            <button
              onClick={clearFilters}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Search by Author
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Enter author name"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-amber-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', Number(e.target.value))}
                className="w-full py-2 px-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-amber-50"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating ?? ''}
                onChange={(e) =>
                  handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full py-2 px-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-amber-50"
              >
                <option value="">All Ratings</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+ Stars
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full py-2 px-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-amber-50"
              >
                <option value="">All Books</option>
                <option value="available">Available Now</option>
                <option value="borrowed">Currently Borrowed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full py-2 px-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-amber-50"
              >
                <option value="">Default</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-900">
              {loading ? 'Loading books...' : `${books.length} Books Found`}
            </h2>
            {!loading && books.length > 0 && (
              <p className="text-amber-700">
                Showing {books.length} result{books.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-amber-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-amber-200 h-4 rounded mb-2"></div>
                <div className="bg-amber-200 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No Books Found</h3>
            <p className="text-amber-700 mb-4">
              Try adjusting your filters or search terms to find more books.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-10 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-amber-800">
          <p className="text-2xl font-bold text-amber-900 mb-2"> ELibrary 📚</p>
          <p className="text-md mb-1">Explore. Read. Share Knowledge.</p>
          <p className="text-sm">© {new Date().getFullYear()} All rights reserved. Built with ❤️ by Kiran</p>
        </div>
      </footer>

    </div>
  );
};

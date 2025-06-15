import { useState, useEffect } from 'react';
import { bookApi } from '../../services/bookApi';
import type { Book, User, Borrow } from '../../types';
import { toast } from 'react-toastify';
import { borrowApi } from '../../services/borrowApi';
import { userApi } from '../../services/userApi';
import {
  BookOpen,
  Users,
  Clock,
  Plus,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Search,
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react';

export const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    categoryId: '',
    totalCopies: '',
    coverImage: null as File | null,
    ebookFile: null as File | null
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, usersData, borrowsData] = await Promise.all([
          bookApi.getBooks({}),
          userApi.getUsers(),
          borrowApi.getBorrowHistory()
        ]);
        setBooks(booksData);
        setUsers(usersData);
        setBorrows(borrowsData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', bookForm.title);
    formData.append('author', bookForm.author);
    formData.append('description', bookForm.description);
    formData.append('categoryId', bookForm.categoryId);
    formData.append('totalCopies', bookForm.totalCopies);
    if (bookForm.coverImage) formData.append('coverImage', bookForm.coverImage);
    if (bookForm.ebookFile) formData.append('ebookFile', bookForm.ebookFile);

    // DEBUG: Show form content
    console.log('__________________________________')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('___________________________________')
    try {
      await bookApi.createBook(formData);
      toast.success('Book added successfully');
      const updatedBooks = await bookApi.getBooks({});
      setBooks(updatedBooks);
      setShowAddBookForm(false);
      setBookForm({
        title: '',
        author: '',
        description: '',
        categoryId: '',
        totalCopies: '',
        coverImage: null,
        ebookFile: null
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to add book');
    }
  };


  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(book => (book.totalCopies - book.borrowedCopies) > 0).length,
    totalUsers: users.length,
    activeLoans: borrows.filter(b => !b.returnDate).length,
    overdueBooks: borrows.filter(b => new Date(b.dueDate) < new Date() && !b.returnDate).length,
    totalLoans: borrows.length
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your digital library system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Books</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalBooks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.availableBooks}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Loans</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.activeLoans}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Calendar size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueBooks}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Loans</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalLoans}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <Clock size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 mb-8">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'books', label: 'Books Management', icon: BookOpen },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'loans', label: 'Loans', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${selectedTab === tab.id
                  ? 'bg-slate-100 text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {borrows.slice(0, 5).map((borrow) => (
                  <div key={borrow.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Book borrowed</p>
                        <p className="text-sm text-slate-600">Due: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${borrow.returnDate
                      ? 'bg-green-100 text-green-800'
                      : new Date(borrow.dueDate) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {borrow.returnDate ? 'Returned' : new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'books' && (
          <div className="space-y-6">
            {/* Add Book Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-slate-800">Books Management</h3>
              <button
                onClick={() => setShowAddBookForm(!showAddBookForm)}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add New Book
              </button>
            </div>

            {/* Add Book Form */}
            {showAddBookForm && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <h4 className="text-xl font-semibold text-slate-800 mb-4">Add New Book</h4>
                <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={bookForm.description}
                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      placeholder="Enter book description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category ID</label>
                    <input
                      type="number"
                      name="categoryId"
                      value={bookForm.categoryId}
                      onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      placeholder="Enter category ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Total Copies</label>
                    <input
                      type="number"
                      name="totalCopies"
                      value={bookForm.totalCopies}
                      onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      placeholder="Enter total copies"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                    <input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={(e) =>
                        setBookForm({ ...bookForm, coverImage: e.target.files?.[0] || null })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-book File</label>
                    <input
                      type="file"
                      name="ebookFile"
                      accept=".pdf"
                      onChange={(e) =>
                        setBookForm({ ...bookForm, ebookFile: e.target.files?.[0] || null })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Add Book
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddBookForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Books List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-slate-800">All Books ({books.length})</h4>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Total Copies</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Available</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-800">{book.title}</td>
                        <td className="py-3 px-4 text-slate-600">{book.author}</td>
                        <td className="py-3 px-4 text-slate-600">{book.totalCopies}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${(book.totalCopies - book.borrowedCopies) > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {(book.totalCopies - book.borrowedCopies)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-4">User Management</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Active Loans</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {borrows.filter(b => b.userId === user.id && !b.returnDate).length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'loans' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Loan Management</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Book ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">User ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Borrow Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((borrow) => (
                    <tr key={borrow.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{borrow.bookId}</td>
                      <td className="py-3 px-4 text-slate-600">{borrow.userId}</td>
                      <td className="py-3 px-4 text-slate-600">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-600">{new Date(borrow.dueDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${borrow.returnDate
                          ? 'bg-green-100 text-green-800'
                          : new Date(borrow.dueDate) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {borrow.returnDate ? 'Returned' : new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          {!borrow.returnDate && (
                            <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
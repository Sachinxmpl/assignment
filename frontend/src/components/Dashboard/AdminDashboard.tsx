import { useState, useEffect } from 'react';
import { bookApi } from '../../services/bookApi';
import { borrowApi } from '../../services/borrowApi';
import { userApi } from '../../services/userApi';
import type { Book, User, Borrow, Category } from '../../types';
import { toast } from 'react-toastify';
import {
  BookOpen, Users, Clock, Plus, TrendingUp, AlertTriangle, Calendar, Search,
  Edit, Trash2, Download, Eye, CheckCircle, BarChart
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    ebookFile: null as File | null,
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, usersData, borrowsData, categoriesData] = await Promise.all([
          bookApi.getBooks({}),
          userApi.getUsers(),
          borrowApi.getBorrowHistory(),
          bookApi.getCategories(),
        ]);
        setBooks(booksData);
        setUsers(usersData);
        setBorrows(borrowsData);
        setCategories(categoriesData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showAddBookForm) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [showAddBookForm]);


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
        ebookFile: null,
      });
      setCoverPreview(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await bookApi.deleteBook(id);
      toast.success('Book deleted successfully');
      setBooks(books.filter((book) => book.id !== id));
      setShowDeleteModal(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleReturnLoan = async (id: number) => {
    try {
      await borrowApi.returnBook(id);
      toast.success('Book returned');
      const updatedBorrows = await borrowApi.getBorrowHistory();
      setBorrows(updatedBorrows);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'coverImage' | 'ebookFile') => {
    const file = e.target.files?.[0] || null;
    setBookForm({ ...bookForm, [type]: file });
    if (type === 'coverImage' && file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  };

  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(book => (book.totalCopies - book.borrowedCopies) > 0).length,
    totalUsers: users.length,
    activeLoans: borrows.filter(b => !b.returnDate).length,
    overdueBooks: borrows.filter(b => new Date(b.dueDate) < new Date() && !b.returnDate).length,
    totalLoans: borrows.length,
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loanChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Loans',
      data: [12, 19, 3, 5, 2, 3], // Placeholder; replace with real data
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      tension: 0.4,
    }],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-poppins">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 font-poppins">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setShowAddBookForm(true)}
            className="cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Book
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'indigo' },
            { label: 'Available Books', value: stats.availableBooks, icon: TrendingUp, color: 'emerald' },
            { label: 'Active Users', value: stats.totalUsers, icon: Users, color: 'purple' },
            { label: 'Active Loans', value: stats.activeLoans, icon: Calendar, color: 'blue' },
            { label: 'Overdue', value: stats.overdueBooks, icon: AlertTriangle, color: 'red' },
            { label: 'Total Loans', value: stats.totalLoans, icon: Clock, color: 'gray' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-700">{stat.label}</p>
                  <p className="text-2xl font-bold text-indigo-900">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                  <stat.icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'books', label: 'Books Management', icon: BookOpen },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'loans', label: 'Loans', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selectedTab === tab.id
                  ? 'bg-indigo-100 text-indigo-900 shadow-md'
                  : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50'
                  }`}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Loan Trends Chart */}
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-indigo-900">Loan Trends</h3>
                <BarChart size={24} className="text-indigo-600" />
              </div>
              <div className="h-64">
                <Line data={loanChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {borrows.slice(0, 5).map((borrow) => (
                  <div key={borrow.id} className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <BookOpen size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-indigo-900">Book borrowed</p>
                        <p className="text-sm text-indigo-600">Due: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${borrow.returnDate
                        ? 'bg-emerald-100 text-emerald-800'
                        : new Date(borrow.dueDate) < new Date()
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
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
            {/* Books List */}
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-indigo-900">All Books ({filteredBooks.length})</h4>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/80"
                    />
                  </div>
                  <button
                    onClick={() => exportToCSV(filteredBooks as unknown as Record<string, unknown>[], 'books')}
                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all duration-300"
                  >
                    <Download size={18} className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-indigo-100">
                      <th className="text-left py-3 px-4 font-medium text-indigo-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-indigo-700">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-indigo-700">Total Copies</th>
                      <th className="text-left py-3 px-4 font-medium text-indigo-700">Available</th>
                      <th className="text-left py-3 px-4 font-medium text-indigo-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-indigo-50 hover:bg-indigo-50/50">
                        <td className="py-3 px-4 font-medium text-indigo-900">{book.title}</td>
                        <td className="py-3 px-4 text-indigo-600">{book.author}</td>
                        <td className="py-3 px-4 text-indigo-600">{book.totalCopies}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${book.totalCopies - book.borrowedCopies > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {book.totalCopies - book.borrowedCopies}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-indigo-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-indigo-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300">
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(book.id)}
                              className="p-2 text-indigo-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
                            >
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
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-indigo-900">User Management ({users.length})</h4>
              <button
                onClick={() => exportToCSV(users as unknown as Record<string, unknown>[], 'users')}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all duration-300"
              >
                <Download size={18} className="mr-2" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-100">
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Active Loans</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-indigo-50 hover:bg-indigo-50/50">
                      <td className="py-3 px-4 font-medium text-indigo-900">{user.name}</td>
                      <td className="py-3 px-4 text-indigo-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-indigo-600">
                        {borrows.filter(b => b.userId === user.id && !b.returnDate).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'loans' && (
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-indigo-900">Loan Management ({borrows.length})</h4>
              <button
                onClick={() => exportToCSV(borrows as unknown as Record<string, unknown>[], 'loans')}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all duration-300"
              >
                <Download size={18} className="mr-2" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-100">
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Book ID</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">User ID</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Borrow Date</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-indigo-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((borrow) => (
                    <tr key={borrow.id} className="border-b border-indigo-50 hover:bg-indigo-50/50">
                      <td className="py-3 px-4 font-medium text-indigo-900">{borrow.bookId}</td>
                      <td className="py-3 px-4 text-indigo-600">{borrow.userId}</td>
                      <td className="py-3 px-4 text-indigo-600">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-indigo-600">{new Date(borrow.dueDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${borrow.returnDate
                            ? 'bg-emerald-100 text-emerald-800'
                            : new Date(borrow.dueDate) < new Date()
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {borrow.returnDate ? 'Returned' : new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-indigo-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300">
                            <Eye size={16} />
                          </button>
                          {!borrow.returnDate && (
                            <button
                              onClick={() => handleReturnLoan(borrow.id)}
                              className="p-2 text-indigo-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300"
                            >
                              <CheckCircle size={16} />
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">Confirm Delete</h2>
              <p className="text-indigo-600">Are you sure you want to delete this book? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-200 text-indigo-900 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBook(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>



      {showAddBookForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-white rounded-3xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <button
              onClick={() => setShowAddBookForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">📚 Add New Book</h2>

            <form onSubmit={handleAddBook} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Book Title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="border border-indigo-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="border border-indigo-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <textarea
                placeholder="Description"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                className="border border-indigo-300 rounded-xl p-3 w-full h-28 focus:ring-2 focus:ring-indigo-400"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <select
                  value={bookForm.categoryId}
                  onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
                  className="border border-indigo-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Total Copies"
                  value={bookForm.totalCopies}
                  onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                  className="border border-indigo-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-700">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'coverImage')}
                    className="border border-indigo-300 rounded-xl p-3 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-700">E-book File</label>
                  <input
                    type="file"
                    accept=".pdf,.epub"
                    onChange={(e) => handleFileChange(e, 'ebookFile')}
                    className="border border-indigo-300 rounded-xl p-3 w-full"
                  />
                </div>
              </div>

              {coverPreview && (
                <div className="mt-4">
                  <p className="text-indigo-700 font-medium mb-1">Cover Preview:</p>
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="max-h-48 rounded-xl border border-indigo-200 shadow"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddBookForm(false)}
                  className="bg-gray-100 text-indigo-800 px-5 py-2 rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-semibold cursor-pointer"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





    </div>
  );
};
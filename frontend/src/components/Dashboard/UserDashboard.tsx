import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, User, Settings, Star, Clock, TrendingUp, Heart } from 'lucide-react';

export const UserDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 max-w-2xl mx-auto">
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-slate-600">
              Ready to explore your digital library today?
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* My Books */}
          <Link
            to="/my-books"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                →
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">My Books</h3>
            <p className="text-slate-600">
              View and manage your borrowed books, track due dates, and return books easily.
            </p>
          </Link>

          {/* Browse Library */}
          <Link
            to="/"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
              <div className="text-emerald-600 group-hover:translate-x-1 transition-transform duration-300">
                →
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Browse Library</h3>
            <p className="text-slate-600">
              Discover new books, search by author or category, and find your next great read.
            </p>
          </Link>

          {/* Profile Settings */}
          <Link
            to="/profile"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                <Settings size={24} className="text-purple-600" />
              </div>
              <div className="text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
                →
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Profile Settings</h3>
            <p className="text-slate-600">
              Update your account information, preferences, and manage your library profile.
            </p>
          </Link>
        </div>

        {/* Activity Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Star size={24} className="text-yellow-500 mr-3" />
            Your Library Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reading Stats */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Books Read</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-slate-600 mt-1">This month</p>
            </div>

            {/* Current Borrows */}
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Currently Borrowed</h3>
              <p className="text-2xl font-bold text-emerald-600">0</p>
              <p className="text-sm text-slate-600 mt-1">Active loans</p>
            </div>

            {/* Bookmarks */}
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Bookmarked</h3>
              <p className="text-2xl font-bold text-pink-600">0</p>
              <p className="text-sm text-slate-600 mt-1">Saved for later</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Use filters on the home page to find books by genre, author, or rating
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Bookmark interesting books to read them later
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Leave reviews to help other readers discover great books
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
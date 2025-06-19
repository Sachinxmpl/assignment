import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Menu, X, User, LogOut, BookOpen, Home, LayoutDashboard, Book } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 shadow-lg border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-amber-200 h-6 w-32 rounded"></div>
            <div className="animate-pulse bg-amber-200 h-6 w-48 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 shadow-lg border-b border-amber-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-amber-900 hover:text-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              <Book className="mr-2 text-orange-600" size={28} />
              <span className="bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                Digital Library
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActiveRoute('/')
                ? 'bg-amber-200 text-amber-900 shadow-md'
                : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                }`}
            >
              <Home size={16} className="mr-2" />
              Home
            </Link>

            {user ? (
              user.role === 'ADMIN' ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActiveRoute('/admin-dashboard')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Admin
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-300 ml-2 border border-red-200 hover:border-red-300"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/my-books"
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActiveRoute('/my-books')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                  >
                    <BookOpen size={16} className="mr-2" />
                    My Books
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActiveRoute('/dashboard')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActiveRoute('/profile')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                  >
                    <User size={16} className="mr-2" />
                    {user.name || user.email || 'Profile'}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-300 ml-2 border border-red-200 hover:border-red-300"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${isActiveRoute('/login')
                    ? 'bg-amber-200 text-amber-900 shadow-md border-amber-300'
                    : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100 border-amber-300'
                    }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-amber-800 hover:text-orange-700 focus:outline-none p-2 rounded-lg hover:bg-amber-100 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-amber-50 to-orange-50 shadow-xl border-t border-amber-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/')
                ? 'bg-amber-200 text-amber-900 shadow-md'
                : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} className="mr-3" />
              Home
            </Link>

            {user ? (
              user.role === 'ADMIN' ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/admin-dashboard')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} className="mr-3" />
                    Admin Dashboard
                  </Link>

                  <div className="pt-2 border-t border-amber-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-300"
                    >
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/my-books"
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/my-books')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen size={18} className="mr-3" />
                    My Books
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/dashboard')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} className="mr-3" />
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/profile')
                      ? 'bg-amber-200 text-amber-900 shadow-md'
                      : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} className="mr-3" />
                    {user.name || user.email || 'Profile'}
                  </Link>

                  <div className="pt-2 border-t border-amber-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-300"
                    >
                      <LogOut size={18} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${isActiveRoute('/login')
                    ? 'bg-amber-200 text-amber-900 shadow-md'
                    : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-base font-medium transition-all duration-300 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { BookDetailPage } from './pages/BookDetailPage';
import { Login } from './pages/Login';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Register } from './pages/Register';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { Profile } from './pages/Profile';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react';
import { MyBooks } from './pages/MyBooks';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  return user && user.role === 'ADMIN' ? children : <Navigate to="/" />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetailPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
};
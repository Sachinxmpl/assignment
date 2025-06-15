import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, BookOpen, Award } from 'lucide-react';

export const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">My Profile</h1>
          <p className="text-amber-700">Manage your library account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">{user.name}</h2>
                <p className="text-amber-700 mb-4">{user.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  <Shield size={14} className="mr-1" />
                  {user.role}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 mt-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-orange-500 mr-2" />
                    <span className="text-amber-800">Books Borrowed</span>
                  </div>
                  <span className="font-semibold text-amber-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award size={16} className="text-orange-500 mr-2" />
                    <span className="text-amber-800">Books Completed</span>
                  </div>
                  <span className="font-semibold text-amber-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-orange-500 mr-2" />
                    <span className="text-amber-800">Member Since</span>
                  </div>
                  <span className="font-semibold text-amber-900">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-6">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-900">{user.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    <Shield size={16} className="inline mr-2" />
                    Account Role
                  </label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-900">{user.role}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Account Status
                  </label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-200">
                <h4 className="text-lg font-semibold text-amber-900 mb-4">Account Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg font-medium transition-all duration-300">
                    Change Password
                  </button>
                  <button className="px-4 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg font-medium transition-all duration-300">
                    Privacy Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200 mt-6">
              <h3 className="text-xl font-bold text-amber-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <BookOpen size={20} className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-amber-900 font-medium">Borrowed "The Great Gatsby"</p>
                    <p className="text-amber-600 text-sm">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Award size={20} className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-amber-900 font-medium">Completed "To Kill a Mockingbird"</p>
                    <p className="text-amber-600 text-sm">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <BookOpen size={20} className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-amber-900 font-medium">Added "1984" to wishlist</p>
                    <p className="text-amber-600 text-sm">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useEffect, useState } from 'react';
import { borrowApi } from '../services/borrowApi';
import type { Borrow } from '../types';
import { useBorrow } from '../hooks/useBorrow';
import { toast } from 'react-toastify';
import { BookOpen, Calendar, AlertCircle, CheckCircle, DollarSign, RotateCcw } from 'lucide-react';

export const MyBooks = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const { returnBook, loading: returnLoading } = useBorrow();

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        const data = await borrowApi.getBorrowHistory();
        setBorrows(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch borrowed books');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId: number) => {
    try {
      await returnBook(borrowId);
      const updatedBorrows = await borrowApi.getBorrowHistory();
      setBorrows(updatedBorrows);
      toast.success('Book returned successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  const isOverdue = (dueDate: string, returnDate?: string) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string, returnDate?: string) => {
    if (returnDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeBorrows = borrows.filter(b => !b.returnDate);
  const returnedBorrows = borrows.filter(b => b.returnDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">My Library</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Track your borrowed books, due dates, and reading history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Currently Borrowed</h3>
                <p className="text-3xl font-bold text-blue-600">{activeBorrows.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Books Read</h3>
                <p className="text-3xl font-bold text-emerald-600">{returnedBorrows.length}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Overdue Books</h3>
                <p className="text-3xl font-bold text-red-600">
                  {activeBorrows.filter(b => isOverdue(b.dueDate)).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Currently Borrowed Books */}
        {activeBorrows.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <BookOpen size={24} className="text-blue-600 mr-3" />
              Currently Borrowed
            </h2>
            <div className="space-y-4">
              {activeBorrows.map(borrow => {
                const daysUntilDue = getDaysUntilDue(borrow.dueDate);
                const overdue = isOverdue(borrow.dueDate);
                
                return (
                  <div
                    key={borrow.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                      overdue ? 'border-red-200 bg-red-50/50' : 'border-white/50'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {borrow.book.title}
                              </h3>
                              <p className="text-slate-600 mb-3">by {borrow.book.author}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center text-slate-600">
                                  <Calendar size={16} className="mr-2" />
                                  Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                                </div>
                                <div className={`flex items-center ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                                  <Calendar size={16} className="mr-2" />
                                  Due: {new Date(borrow.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex flex-col items-end">
                              {overdue ? (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                  Overdue
                                </span>
                              ) : daysUntilDue !== null && daysUntilDue <= 3 ? (
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                  Due Soon
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                  Active
                                </span>
                              )}
                              
                              {daysUntilDue !== null && (
                                <span className="text-sm text-slate-500">
                                  {daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Fine Information */}
                          {borrow.fine > 0 && (
                            <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                              <DollarSign size={16} className="mr-2" />
                              <span className="text-sm font-medium">Fine: ${borrow.fine}</span>
                            </div>
                          )}
                        </div>

                        {/* Return Button */}
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <button
                            onClick={() => handleReturn(borrow.id)}
                            disabled={returnLoading}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            <RotateCcw size={18} className="mr-2" />
                            {returnLoading ? 'Returning...' : 'Return Book'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reading History */}
        {returnedBorrows.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <CheckCircle size={24} className="text-emerald-600 mr-3" />
              Reading History
            </h2>
            <div className="space-y-4">
              {returnedBorrows.map(borrow => (
                <div
                  key={borrow.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {borrow.book.title}
                        </h3>
                        <p className="text-slate-600 mb-3">by {borrow.book.author}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Returned: {new Date(borrow.returnDate!).toLocaleDateString()}
                          </div>
                          {borrow.fine > 0 && (
                            <div className="flex items-center text-red-600">
                              <DollarSign size={16} className="mr-2" />
                              Fine Paid: ${borrow.fine}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0">
                        <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {borrows.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 max-w-md mx-auto">
              <BookOpen size={64} className="mx-auto text-slate-400 mb-6" />
              <h3 className="text-xl font-semibold text-slate-800 mb-4">No Books Yet</h3>
              <p className="text-slate-600 mb-6">
                You haven't borrowed any books yet. Start exploring our library to find your next great read!
              </p>
              <a
                href="/"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <BookOpen size={18} className="mr-2" />
                Browse Library
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
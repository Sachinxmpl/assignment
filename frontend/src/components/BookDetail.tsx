import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookApi } from '../services/bookApi';
import { borrowApi } from '../services/borrowApi';
import { ReviewModal } from '../components/ReviewModal';
import type { Book } from '../types';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import {
  Star,
  BookOpen,
  Bookmark,
  Download,
  Calendar,
  User,
  Tag,
  MessageCircle,
  Share2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await bookApi.getBookById(Number(id));
        setBook(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleBorrow = async () => {
    if (!book) return;

    try {
      setBorrowing(true);
      await borrowApi.borrowBook(book.id);
      toast.success('Book borrowed successfully');
      const updatedBook = await bookApi.getBookById(book.id);
      setBook(updatedBook);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleBookmark = async () => {
    if (!book) return;

    try {
      setBookmarking(true);
      await bookApi.bookmarkBook(book.id);
      toast.success('Book bookmarked');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to bookmark book');
    } finally {
      setBookmarking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: `Check out "${book?.title}" by ${book?.author}`,
          url: window.location.href,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Book Not Found</h2>
          <p className="text-slate-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageRating = book.reviews.length > 0
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : null;

  const isAvailable = book.totalCopies > book.borrowedCopies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Book Details Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Book Cover */}
            <div className="lg:w-1/3 p-8">
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  {isAvailable ? (
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      Not Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:w-2/3 p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    <Tag size={14} className="inline mr-1" />
                    {book.category.name}
                  </span>
                  <button
                    onClick={handleShare}
                    className="text-slate-500 hover:text-indigo-600 transition-colors duration-300"
                    title="Share this book"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-slate-800 mb-4">{book.title}</h1>

              <div className="flex items-center text-slate-600 mb-6">
                <User size={20} className="mr-2" />
                <span className="text-lg">by {book.author}</span>
              </div>

              {/* Rating */}
              {averageRating && (
                <div className="flex items-center mb-6">
                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star size={20} className="text-yellow-500 mr-2 fill-current" />
                    <span className="text-lg font-semibold text-slate-800">
                      {averageRating}/5
                    </span>
                    <span className="text-sm text-slate-600 ml-2">
                      ({book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 font-medium flex items-center">
                    <BookOpen size={18} className="mr-2" />
                    Availability
                  </span>
                  <span className="text-lg font-semibold text-slate-800">
                    {book.totalCopies - book.borrowedCopies}/{book.totalCopies} copies
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    style={{
                      width: `${((book.totalCopies - book.borrowedCopies) / book.totalCopies) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Description</h3>
                <p className="text-slate-600 leading-relaxed">{book.description}</p>
              </div>

              {/* Action Buttons */}
              {user && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleBorrow}
                    disabled={!isAvailable || borrowing}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <BookOpen size={18} className="mr-2" />
                    {borrowing ? 'Borrowing...' : 'Borrow Book'}
                  </button>

                  <button
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Bookmark size={18} className="mr-2" />
                    {bookmarking ? 'Bookmarking...' : 'Bookmark'}
                  </button>

                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Add Review
                  </button>

                  {book.borrowedCopies > 0 && book.ebookUrl && (
                    <a
                      href={book.ebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      <Download size={18} className="mr-2" />
                      Download PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <MessageCircle size={24} className="text-indigo-600 mr-3" />
            Reviews ({book.reviews.length})
          </h2>

          {book.reviews.length > 0 ? (
            <div className="space-y-6">
              {book.reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${i < review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-slate-300'
                                }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium text-slate-700">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar size={14} className="mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-slate-700 leading-relaxed ml-13">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Reviews Yet</h3>
              <p className="text-slate-600 mb-4">
                Be the first to share your thoughts about this book!
              </p>
              {user && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Write First Review
                </button>
              )}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <ReviewModal
            bookId={book.id}
            onClose={() => setShowReviewModal(false)}
          />
        )}
      </div>
    </div>
  );
};
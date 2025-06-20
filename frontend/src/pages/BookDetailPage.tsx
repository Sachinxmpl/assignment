import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { bookApi } from '../services/bookApi';
import { borrowApi } from '../services/borrowApi';
import { ReviewModal } from '../components/ReviewModal';
import type { Book } from '../types';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { Star, X } from 'lucide-react';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  useEffect(() => {
    bookApi.getBookById(Number(id))
      .then(setBook)
      .catch(() => toast.error('Failed to fetch book'));
  }, [id]);

  useEffect(() => {
    const shouldLockScroll = showReviewModal || showDeleteConfirm || showImagePopup;

    if (shouldLockScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showReviewModal, showDeleteConfirm, showImagePopup]);

  const hasUserBorrowed = user?.role === 'USER' && (book?.borrowedCopies ?? 0) > 0;

  const handleBorrowOrReturn = async () => {
    try {
      if (hasUserBorrowed) {
        console.log("!@@@@#%$^&*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        await borrowApi.returnBook(Number(id));
        toast.success('Book returned successfully');
      } else {
        await borrowApi.borrowBook(Number(id));
        toast.success('Book borrowed successfully');
      }
      const updatedBook = await bookApi.getBookById(Number(id));
      setBook(updatedBook);
    } catch {
      toast.error(`Failed to ${hasUserBorrowed ? 'return' : 'borrow'} book`);
    }
  };

  const handleBookmark = async () => {
    try {
      await bookApi.bookmarkBook(Number(id));
      toast.success('Book bookmarked');
    } catch {
      toast.error('Failed to bookmark book');
    }
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    try {
      await bookApi.deleteBook(book.id);
      toast.success('Book deleted successfully');
      navigate('/');
    } catch {
      toast.error('Failed to delete book');
    }
  };

  if (!book) {
    return <div className="text-center py-20 text-lg text-gray-500">Loading book details...</div>;
  }

  const averageRating = book.reviews.length > 0
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : null;

  const showDownloadPdf = user?.role === 'ADMIN' || hasUserBorrowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-20 to-blue-100 px-4 py-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Book Overview */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full md:w-1/3 h-[24rem] object-cover rounded-lg cursor-pointer"
            onClick={() => setShowImagePopup(true)}
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-700 mb-1">by <span className="font-medium">{book.author}</span></p>
            <p className="text-sm text-orange-700 font-semibold mb-4">{book.category.name}</p>

            <p className="text-gray-800 mb-4">{book.description}</p>

            <p className="text-gray-600 mb-1">
              Availability: <strong>{book.totalCopies - book.borrowedCopies}/{book.totalCopies}</strong>
            </p>

            {averageRating && (
              <p className="flex items-center text-sm text-yellow-700 mb-2">
                <Star size={16} className="mr-1 fill-current" />
                Average Rating: <span className="ml-1 font-semibold">{averageRating}/5</span>
              </p>
            )}


            {user && (
              <div className="mt-6 flex flex-wrap gap-3">
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={handleBorrowOrReturn}
                    className={`px-4 py-2 rounded cursor-pointer text-white font-medium transition ${hasUserBorrowed
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    disabled={!hasUserBorrowed && book.totalCopies <= book.borrowedCopies}
                  >
                    {hasUserBorrowed ? 'Return Book' : 'Borrow Book'}
                  </button>
                )}

                <button
                  onClick={handleBookmark}
                  className="px-4 py-2 rounded bg-green-600 text-white font-medium transition hover:bg-green-700 cursor-pointer"
                >
                  Bookmark
                </button>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 rounded bg-purple-600 text-white font-medium transition hover:bg-purple-700 cursor-pointer"
                >
                  Add Review
                </button>

                {showDownloadPdf && (
                  <a
                    href={book.ebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-yellow-500 text-white font-medium transition hover:bg-yellow-600"
                  >
                    Download PDF
                  </a>
                )}

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded bg-red-600 text-white font-medium transition hover:bg-red-700 cursor-pointer"
                  >
                    Delete Book
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Reviews</h2>
          {book.reviews.length > 0 ? (
            <div className="space-y-5">
              {book.reviews.map((review) => (
                <div key={review.id} className="bg-amber-100/60 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-yellow-700">
                      <Star size={16} className="mr-1 fill-current" />
                      <span className="font-semibold">{review.rating}/5</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
          )}
        </section>
      </div>

      {showReviewModal && (
        <ReviewModal
          bookId={book.id}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={async () => {
            const updated = await bookApi.getBookById(book.id);
            setBook(updated);
          }}
        />
      )}


      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold text-red-700 mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this book? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBook}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImagePopup(false)}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="max-h-[90vh] max-w-full rounded-lg shadow-lg"
            onClick={e => e.stopPropagation()} // prevent closing when clicking image itself
          />
          <button
            onClick={() => setShowImagePopup(false)}
            className="absolute top-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 cursor-pointer"
            aria-label="Close image popup"
          >
            <X size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

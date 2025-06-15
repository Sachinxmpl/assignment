import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookApi } from '../services/bookApi';
import { borrowApi } from '../services/borrowApi';
import { ReviewModal } from '../components/ReviewModal';
import type { Book } from '../types';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    bookApi.getBookById(Number(id)).then(setBook).catch(() => toast.error('Failed to fetch book'));
  }, [id]);

  const handleBorrow = async () => {
    try {
      await borrowApi.borrowBook(Number(id));
      toast.success('Book borrowed successfully');
      bookApi.getBookById(Number(id)).then(setBook);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to borrow book');
    }
  };

  const handleBookmark = async () => {
    try {
      await bookApi.bookmarkBook(Number(id));
      toast.success('Book bookmarked');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to bookmark book');
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={book.coverImage} alt={book.title} className="w-full md:w-1/3 h-96 object-cover rounded" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">{book.category.name}</p>
          <p className="mt-4">{book.description}</p>
          <p className="mt-2">
            Availability: {book.totalCopies - book.borrowedCopies}/{book.totalCopies}
          </p>
          {book.reviews.length > 0 && (
            <p>
              Rating: {(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)}/5
            </p>
          )}
          {user && (
            <div className="mt-4 space-x-2">
              <button
                onClick={handleBorrow}
                disabled={book.totalCopies <= book.borrowedCopies}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                Borrow
              </button>
              <button
                onClick={handleBookmark}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Bookmark
              </button>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Add Review
              </button>
              {book.borrowedCopies > 0 && (
                <a
                  href={book.ebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-600 text-white rounded inline-block"
                >
                  Download PDF
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {book.reviews.map((review) => (
          <div key={review.id} className="border-t py-4">
            <p>Rating: {review.rating}/5</p>
            {review.comment && <p>{review.comment}</p>}
            <p className="text-sm text-gray-500">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {showReviewModal && <ReviewModal bookId={book.id} onClose={() => setShowReviewModal(false)} />}
    </div>
  );
};
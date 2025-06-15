import type { Book } from '../types';

interface BookDetailProps {
  book: Book;
  onBorrow: () => void;
  onBookmark: () => void;
  onReview: () => void;
  canBorrow: boolean;
  canDownload: boolean;
}

export const BookDetail = ({ book, onBorrow, onBookmark, onReview, canBorrow, canDownload }: BookDetailProps) => {
  return (
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
        <div className="mt-4 space-x-2">
          <button
            onClick={onBorrow}
            disabled={!canBorrow}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Borrow
          </button>
          <button
            onClick={onBookmark}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Bookmark
          </button>
          <button
            onClick={onReview}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Add Review
          </button>
          {canDownload && (
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
      </div>
    </div>
  );
};
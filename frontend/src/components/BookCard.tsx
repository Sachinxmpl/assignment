import { Link } from 'react-router-dom';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/books/${book.id}`} className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-500">{book.category.name}</p>
      <p className="text-sm mt-2">
        Availability: {book.totalCopies - book.borrowedCopies}/{book.totalCopies}
      </p>
      {book.reviews.length > 0 && (
        <p className="text-sm">
          Rating: {(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)}/5
        </p>
      )}
    </Link>
  );
};
import { Link } from 'react-router-dom';
import type { Book } from '../types';
import { Star, BookOpen, Users } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const averageRating = book.reviews.length > 0
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : null;

  const availabilityPercentage = ((book.totalCopies - book.borrowedCopies) / book.totalCopies) * 100;
  const isAvailable = book.totalCopies > book.borrowedCopies;

  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-74 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {isAvailable ? 'Available' : 'Borrowed'}
          </span>
        </div>

        {averageRating && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center">
            <Star size={10} className="text-yellow-400 mr-1 fill-current" />
            {averageRating}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {book.title}
        </h3>

        <p className="text-xs text-slate-600 mb-1">{book.author}</p>

        <div className="mb-2">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-medium">
            {book.category.name}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-0.5">
            <span className="flex items-center">
              <BookOpen size={12} className="mr-1" />
              {book.totalCopies - book.borrowedCopies}/{book.totalCopies}
            </span>
            <span>{availabilityPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${availabilityPercentage > 50
                ? 'bg-emerald-500'
                : availabilityPercentage > 20
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>


        <div className="text-[11px] flex items-center justify-between text-slate-600">
          {book.reviews.length > 0 ? (
            <>
              <span className="flex items-center">
                <Star size={12} className="mr-1 text-yellow-400 fill-current" />
                {averageRating}/5
              </span>
              <span className="flex items-center text-slate-500">
                <Users size={12} className="mr-1" />
                {book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span className="flex items-center text-slate-500">
              <Star size={12} className="mr-1" />
              No reviews yet
            </span>
          )}
        </div>

        <div className="mt-2 text-[11px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View Details →
        </div>
      </div>
    </Link>
  );
};

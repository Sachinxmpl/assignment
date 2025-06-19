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
      {/* Book Cover */}
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Available
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Borrowed
            </span>
          )}
        </div>

        {/* Rating Badge */}
        {averageRating && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Star size={12} className="text-yellow-400 mr-1 fill-current" />
            {averageRating}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Book Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-slate-600 mb-2 font-medium">
          by {book.author}
        </p>

        {/* Category */}
        <div className="mb-3">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-xs font-medium">
            {book.category.name}
          </span>
        </div>

        {/* Availability Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
            <span className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              Availability
            </span>
            <span className="font-medium">
              {book.totalCopies - book.borrowedCopies}/{book.totalCopies}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${availabilityPercentage > 50 ? 'bg-emerald-500' :
                availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Rating and Reviews */}
        {book.reviews.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-600">
              <Star size={14} className="text-yellow-500 mr-1 fill-current" />
              <span className="font-medium">{averageRating}/5</span>
            </div>
            <div className="flex items-center text-slate-500">
              <Users size={14} className="mr-1" />
              <span>{book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* No Reviews State */}
        {book.reviews.length === 0 && (
          <div className="text-sm text-slate-500 flex items-center">
            <Star size={14} className="mr-1" />
            No reviews yet
          </div>
        )}

        {/* Hover Effect Indicator */}
        <div className="mt-4 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">View Details</span>
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
};
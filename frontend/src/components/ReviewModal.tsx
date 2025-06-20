import { useState } from 'react';
import { toast } from 'react-toastify';
import { X, Star } from 'lucide-react';
import { bookApi } from '../services/bookApi';

interface ReviewModalProps {
  bookId: number;
  onClose: () => void;
  onReviewAdded?: () => void;
}

export const ReviewModal = ({ bookId, onClose, onReviewAdded }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating from 1 to 5');
      return;
    }

    try {
      setSubmitting(true);
      console.log({bookId, rating , comment})
      await bookApi.createReview({ bookId, rating, comment });
      toast.success('Review submitted');
      onClose();
      onReviewAdded?.();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
        >
          <X size={25} />
        </button>

        <h2 className="text-xl font-bold text-amber-900 mb-5">Add Your Review</h2>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              size={30}
              onClick={() => setRating(num)}
              className={`cursor-pointer transition-all ${num <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                }`}
            />
          ))}
        </div>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Write your thoughts (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-700 cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

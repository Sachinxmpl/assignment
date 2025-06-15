export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  category: { id: number; name: string };
  coverImage: string;
  ebookUrl: string;
  totalCopies: number;
  borrowedCopies: number;
  reviews: Review[];
}

export interface Borrow {
  userId: number;
  id: number;
  bookId: number;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
}

export interface Review {
  id: number;
  userId: number;
  bookId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}
import { Request } from 'express';

export interface User {
    id: number;
    email: string;
    password?: string;
    googleId?: string;
    role: 'USER' | 'ADMIN';
    name: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    categoryId: number;
    coverImage: string;
    ebookUrl: string;
    totalCopies: number;
    borrowedCopies: number;
}

export interface Borrow {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
    fine: number;
}

export interface Review {
    id: number;
    userId: number;
    bookId: number;
    rating: number;
    comment?: string;
}


export interface Category {
    id: number;
    name: string;
}

export interface CustomRequest extends Request {
    user?: User;
}
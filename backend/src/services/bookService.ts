import dbclient from '../config/db'
import { Prisma } from '@prisma/client';

export const bookService = {
    createBook: async (data: {
        title: string;
        author: string;
        description: string;
        categoryId: number;
        coverImage: string;
        ebookUrl: string;
        totalCopies: number;
    }) => {
        console.log("This is inside hte debuggin conloe ")
        console.log(data)
        return dbclient.book.create({
            data: {
                ...data,
                borrowedCopies: 0
            }
        })
    },

    getBooks: async (filters: {
        category?: string;
        author?: string;
        rating?: number;
        availability?: string;
        sortBy?: string;
    }) => {
        const where: Prisma.BookWhereInput = {};
        if (filters.category) {
            where.category = { name: filters.category };
        }
        if (filters.author) {
            where.author = { contains: filters.author, mode: 'insensitive' };
        }
        if (filters.availability === 'available') {
            where.totalCopies = { gt: dbclient.book.fields.borrowedCopies };
        }
        if (filters.rating) {
            where.reviews = { some: { rating: { gte: filters.rating } } };
        }

        const orderBy: Prisma.BookOrderByWithRelationInput = {};
        if (filters.sortBy === 'newest') {
            orderBy.createdAt = 'desc';
        } else if (filters.sortBy === 'rating') {
            orderBy.reviews = { _count: 'desc' };
        } else if (filters.sortBy === 'popularity') {
            orderBy.borrows = { _count: 'desc' };
        }

        return dbclient.book.findMany({
            where,
            orderBy,
            include: { category: true, reviews: true },
        });
    },

    getBookById: async (id: number) => {
        return dbclient.book.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        })
    },

    updateBook: async (id: number, data: Partial<{
        title: string;
        author: string;
        description: string;
        categoryId: number;
        coverImage: string;
        ebookUrl: string;
        totalCopies: number;
    }>) => {
        return dbclient.book.update({
            where: { id },
            data,
        });
    },

    deleteBook: async (id: number) => {
        return dbclient.book.delete({ where: { id } });
    },
}
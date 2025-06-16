import { Request, Response, RequestHandler } from 'express';
import { bookService } from '../services/bookService';
import { bookSchema, updateBookSchema } from '../zodSchemas/bookSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import cloudinary from '../config/cloudinary';


const getBooks = (async (req: Request, res: Response) => {
    try {
        const { category, author, rating, availability, sortBy } = req.query;
        const books = await bookService.getBooks({
            category: category as string,
            author: author as string,
            rating: rating ? parseInt(rating as string) : undefined,
            availability: availability as string,
            sortBy: sortBy as string,
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}) as RequestHandler

const getBookById = (async (req: Request, res: Response) => {
    try {
        const book = await bookService.getBookById(parseInt(req.params.id));
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
}) as RequestHandler

const createBook = [
    validationMiddleware(bookSchema),
    async (req: Request, res: Response) => {
        console.log('inside creating boook ++++++++++++++++++++++++');
        try {
            console.log('===========================')
            if (
                !req.files ||
                typeof req.files !== 'object' ||
                !('coverImage' in req.files) ||
                !('ebookFile' in req.files)
            ) {
                return res.status(400).json({ message: 'Cover image and ebook file are required' });
            }
            const { coverImage, ebookFile } = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (!coverImage || !ebookFile) {
                return res.status(400).json({ message: 'Cover image and ebook file are required' });
            }
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
            const coverImageResult = await cloudinary.uploader.upload(coverImage[0].path);
            const ebookFileResult = await cloudinary.uploader.upload(ebookFile[0].path, {
                resource_type: 'raw',
                use_filename: true,
                unique_filename: false,
                filename_override: ebookFile[0].originalname,
            });
            console.log(ebookFileResult)
            console.log("cloudinary upload successfull")
            try {
                const bookData = {
                    ...req.body,
                    categoryId: Number(req.body.categoryId),
                    totalCopies: Number(req.body.totalCopies),
                    coverImage: coverImageResult.secure_url,
                    ebookUrl: `${ebookFileResult.secure_url}?fl_attachment=${ebookFile[0].originalname}`,
                }
                console.log("Final Payload ", bookData)
                const book = await bookService.createBook(bookData);
                console.log("Finished creating book data")
                res.status(201).json(book);
            } catch (error) {
                console.log("erro callign the bookservice.createBook")
                res.status(500).json({ message: 'Failed to create book' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Error creating book', error });
        }
    },
];

const updateBook = [
    validationMiddleware(updateBookSchema),
    async (req: Request, res: Response) => {
        try {
            let coverImage, ebookFile;
            if (
                req.files &&
                typeof req.files === 'object' &&
                'coverImage' in req.files &&
                'ebookFile' in req.files
            ) {
                ({ coverImage, ebookFile } = req.files as { [fieldname: string]: Express.Multer.File[] });
            }
            const updateData: any = { ...req.body };

            if (coverImage) {
                const coverImageResult = await cloudinary.uploader.upload(coverImage[0].path);
                updateData.coverImage = coverImageResult.secure_url;
            }

            if (ebookFile) {
                const ebookFileResult = await cloudinary.uploader.upload(ebookFile[0].path, { resource_type: 'raw' });
                updateData.ebookUrl = ebookFileResult.secure_url;
            }

            const book = await bookService.updateBook(parseInt(req.params.id), updateData);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (error) {
            res.status(500).json({ message: 'Error updating book', error });
        }
    },
];

const deleteBook = (async (req, res) => {
    try {
        const book = await bookService.deleteBook(parseInt(req.params.id));
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
}) as RequestHandler;

export const bookController = {
    updateBook,
    deleteBook,
    getBookById,
    getBooks,
    createBook
}
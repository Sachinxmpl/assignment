import express from 'express';
import { protected_route } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';
import multer from 'multer';
import { bookController } from '../controllers/bookController';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post(
    '/',
    protected_route,
    restrictTo('ADMIN'),
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'ebookFile', maxCount: 1 }]),
    bookController.createBook
);
router.put(
    '/:id',
    protected_route,
    restrictTo('ADMIN'),
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'ebookFile', maxCount: 1 }]),
    bookController.updateBook
);
router.delete('/:id', protected_route, restrictTo('ADMIN'), bookController.deleteBook);

export default router;
import express from 'express';
import { borrowController } from '../controllers/borrowController';
import {protected_route} from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/', protected_route, borrowController.borrowBook);
router.post('/return/:id', protected_route, borrowController.returnBook);
router.get('/history', protected_route, borrowController.getBorrowHistory);
router.get('/export', protected_route, restrictTo('ADMIN'), borrowController.exportBorrowHistory);
router.get('/borrow-id',protected_route , borrowController.getBorrowId )

export default router;
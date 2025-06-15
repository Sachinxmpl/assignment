import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { protected_route } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', protected_route, restrictTo('ADMIN'), categoryController.createCategory);
router.put('/:id', protected_route, restrictTo('ADMIN'), categoryController.updateCategory);
router.delete('/:id', protected_route, restrictTo('ADMIN'), categoryController.deleteCategory);

export default router;
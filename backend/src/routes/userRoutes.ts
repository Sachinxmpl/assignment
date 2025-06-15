import express from 'express';
import { userController } from '../controllers/userController';
import { protected_route } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', protected_route, restrictTo('ADMIN'), userController.getUsers);
router.put('/:id', protected_route, restrictTo('ADMIN'), userController.updateUser);
router.delete('/:id', protected_route, restrictTo('ADMIN'), userController.deleteUser);
router.get('/borrows', protected_route, userController.getUserBorrows);

export default router;
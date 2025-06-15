import express from 'express';
import { reviewController } from '../controllers/reviewController';
import { protected_route } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protected_route, reviewController.createReview);
router.get('/', reviewController.getReviews);

export default router;
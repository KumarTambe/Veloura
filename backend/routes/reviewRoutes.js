import express from 'express';
import {
  createReview,
  getReviews,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleLikeReview,
  addReply,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.route('/product/:id').get(getProductReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/like').put(protect, toggleLikeReview);
router.route('/:id/reply').post(protect, addReply);

export default router;

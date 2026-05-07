import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/:productId').delete(protect, removeFromCart);

export default router;

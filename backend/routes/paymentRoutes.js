import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// create-order also returns the Razorpay key ID for the checkout modal
router.route('/create-order').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyRazorpayPayment);

export default router;

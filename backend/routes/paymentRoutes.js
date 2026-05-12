import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/create-order').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyRazorpayPayment);

// Send Razorpay Key ID to frontend securely
router.route('/key').get(protect, (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

export default router;

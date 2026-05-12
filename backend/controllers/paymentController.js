import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Amount is required');
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    res.status(500);
    throw new Error('Razorpay keys are not configured');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Test Mode: Always charge ₹100 so Razorpay works reliably
  // In production, replace with: amount: Math.round(amount * 100)
  console.log(`[Razorpay] Original: ₹${amount}, Charging: ₹100 (test mode)`);

  const options = {
    amount: 10000, // ₹100 in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing Razorpay verification parameters');
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.json({ message: 'Payment verified successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid signature');
  }
});

export { createRazorpayOrder, verifyRazorpayPayment };

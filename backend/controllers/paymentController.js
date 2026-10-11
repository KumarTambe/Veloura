import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const getRazorpay = (res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    res.status(500);
    throw new Error('Razorpay keys are not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const SHIPPING_FIELDS = ['street', 'city', 'state', 'zipCode', 'country'];

// @desc    Create a Pending order from the user's cart + a matching Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Any client-sent amount is deliberately ignored; the total comes from the DB
  const shipping = {};
  for (const field of SHIPPING_FIELDS) {
    const value = shippingAddress?.[field];
    if (typeof value !== 'string' || !value.trim()) {
      res.status(400);
      throw new Error(`Shipping ${field} is required`);
    }
    shipping[field] = value.trim();
  }

  const user = await User.findById(req.user._id).populate('cart.product');
  const cartItems = (user?.cart || []).filter((item) => item.product);

  if (cartItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const orderItems = cartItems.map(({ product, quantity }) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      res.status(400);
      throw new Error(`Invalid quantity for ${product.name}`);
    }
    if (quantity > product.stockQuantity) {
      res.status(400);
      throw new Error(`Only ${product.stockQuantity} of ${product.name} left in stock`);
    }
    return {
      name: product.name,
      quantity,
      price: product.price,
      product: product._id,
    };
  });

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const razorpay = getRazorpay(res);
  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Razorpay expects the amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(502);
    throw new Error('Failed to create Razorpay order');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: shipping,
    paymentMethod: 'Razorpay',
    totalPrice,
    isPaid: false,
    status: 'Pending',
    razorpayOrderId: razorpayOrder.id,
  });

  res.status(201).json({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

const isValidSignature = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// @desc    Verify Razorpay payment, then mark the order paid, reduce stock, clear cart
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing Razorpay verification parameters');
  }

  if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    res.status(400);
    throw new Error('Invalid signature');
  }

  const paymentResult = {
    id: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
  };

  // Atomically claim the Pending order so concurrent/retried verify calls
  // can't reduce stock twice
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id, user: req.user._id, status: 'Pending', isPaid: false },
    { $set: { status: 'Confirming', paymentResult } },
    { returnDocument: 'after' }
  );

  if (!order) {
    const existing = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.user._id });
    if (!existing) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (existing.isPaid) return res.json(existing); // already verified
    res.status(409);
    throw new Error(`Order is ${existing.status.toLowerCase()}`);
  }

  // Reduce stock only if enough is left; roll back on the first shortfall
  const decremented = [];
  let soldOut = null;
  for (const item of order.orderItems) {
    const result = await Product.updateOne(
      { _id: item.product, stockQuantity: { $gte: item.quantity } },
      { $inc: { stockQuantity: -item.quantity } }
    );
    if (result.modifiedCount !== 1) {
      soldOut = item;
      break;
    }
    decremented.push(item);
  }

  if (soldOut) {
    await Promise.all(
      decremented.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stockQuantity: item.quantity } })
      )
    );

    // The customer has already paid, so give the money back
    let refunded = false;
    try {
      await getRazorpay(res).payments.refund(razorpay_payment_id, {
        amount: Math.round(order.totalPrice * 100),
      });
      refunded = true;
    } catch (error) {
      console.error('Razorpay refund failed:', error);
    }

    order.status = refunded ? 'Refunded' : 'Cancelled';
    await order.save();

    res.status(409);
    throw new Error(
      `${soldOut.name} sold out while you were paying. ` +
        (refunded
          ? 'Your payment has been refunded.'
          : 'Please contact support for a refund.')
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Processing';
  const paidOrder = await order.save();

  await User.updateOne({ _id: req.user._id }, { $set: { cart: [] } });

  res.json(paidOrder);
});

export { createRazorpayOrder, verifyRazorpayPayment };

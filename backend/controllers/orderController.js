import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
    status: 'Processing',
  });

  const createdOrder = await order.save();

  // Clear user's cart after successful order
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(201).json(createdOrder);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'username email');

  if (order) {
    // Only allow the order's owner to view it
    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { createOrder, getMyOrders, getOrderById };

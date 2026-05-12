import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if item already in cart
  const existingItem = user.cart.find(
    (item) => item.product.toString() === productId
  );

  const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

  if (newQuantity > product.stockQuantity) {
    res.status(400);
    throw new Error('Cannot add more than available stock');
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  // Return populated cart
  const updatedUser = await User.findById(req.user._id).populate('cart.product');
  res.json(updatedUser.cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.cart = user.cart.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate('cart.product');
  res.json(updatedUser.cart);
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.cart = [];
  await user.save();
  res.json([]);
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (quantity > product.stockQuantity) {
    res.status(400);
    throw new Error('Cannot add more than available stock');
  }

  const existingItem = user.cart.find(
    (item) => item.product.toString() === req.params.productId
  );

  if (existingItem) {
    existingItem.quantity = quantity;
    if (existingItem.quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== req.params.productId
      );
    }
  }

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate('cart.product');
  res.json(updatedUser.cart);
});

export { getCart, addToCart, removeFromCart, clearCart, updateCartQuantity };

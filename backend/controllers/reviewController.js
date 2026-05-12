import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Helper function to update product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  
  const numReviews = reviews.length;
  const rating = numReviews === 0 
    ? 0 
    : reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  const product = await Product.findById(productId);
  if (product) {
    product.numReviews = numReviews;
    product.rating = Math.round(rating * 10) / 10; // Round to 1 decimal
    await product.save();
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { product: productId, rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by you');
  }

  // Check if it's a verified purchase
  // Look for any order by this user containing this product that is paid
  const orders = await Order.find({ user: req.user._id, isPaid: true });
  let isVerifiedPurchase = false;

  for (const order of orders) {
    if (order.orderItems.find((item) => item.product.toString() === productId)) {
      isVerifiedPurchase = true;
      break;
    }
  }

  const review = new Review({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
    isVerifiedPurchase,
  });

  await review.save();

  // Update product's average rating
  await updateProductRating(productId);

  res.status(201).json({ message: 'Review added successfully', review });
});

// @desc    Get all reviews (Global Lounge)
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { sort = 'latest' } = req.query;

  let sortOption = {};
  switch (sort) {
    case 'highest':
      sortOption = { rating: -1, createdAt: -1 };
      break;
    case 'helpful':
      // We will sort by length of likes array later, but mongoose sort on array length requires aggregation.
      // We'll use a simpler approach or fetch all and sort in JS if collection isn't massive.
      // For now, let's just sort by createdAt. To do likes length, we'd need an aggregate.
      // Let's fetch and sort in memory for simplicity in this project.
      break;
    case 'latest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  let reviews = await Review.find({})
    .populate('user', 'username')
    .populate('product', 'name images brand category')
    .populate('replies.user', 'username')
    .sort(sort === 'helpful' ? {} : sortOption);

  if (sort === 'helpful') {
    reviews = reviews.sort((a, b) => b.likes.length - a.likes.length);
  }

  res.json(reviews);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'username')
    .populate('replies.user', 'username')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check ownership
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  await review.save();
  await updateProductRating(review.product);

  res.json(review);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check ownership or admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.product;
  await Review.deleteOne({ _id: review._id });
  
  await updateProductRating(productId);

  res.json({ message: 'Review removed' });
});

// @desc    Toggle Like / Helpful on a review
// @route   PUT /api/reviews/:id/like
// @access  Private
const toggleLikeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const index = review.likes.findIndex((id) => id.toString() === req.user._id.toString());

  if (index === -1) {
    // Like
    review.likes.push(req.user._id);
  } else {
    // Unlike
    review.likes.splice(index, 1);
  }

  await review.save();
  res.json(review.likes);
});

// @desc    Add a reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    res.status(400);
    throw new Error('Reply comment is required');
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const reply = {
    user: req.user._id,
    comment,
  };

  review.replies.push(reply);
  await review.save();

  // Populate to return the full reply info (especially user name)
  const populatedReview = await Review.findById(req.params.id).populate('replies.user', 'username');

  res.status(201).json(populatedReview.replies);
});

export {
  createReview,
  getReviews,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleLikeReview,
  addReply,
};

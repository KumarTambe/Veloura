import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { ratings, comment, wristShotUrl } = req.body;

    if (!ratings || !comment) {
      return res.status(400).json({ message: 'Please provide ratings and a comment' });
    }

    const review = await Review.create({
      user: req.user._id,
      ratings,
      comment,
      wristShotUrl,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'username');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

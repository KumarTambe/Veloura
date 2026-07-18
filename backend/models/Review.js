import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratings: {
    movement: { type: Number, required: true, min: 1, max: 5 },
    finish: { type: Number, required: true, min: 1, max: 5 },
    comfort: { type: Number, required: true, min: 1, max: 5 },
  },
  comment: {
    type: String,
    required: true,
  },
  wristShotUrl: {
    type: String, // Optional image URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Review', reviewSchema);

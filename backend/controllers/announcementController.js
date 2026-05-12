import asyncHandler from 'express-async-handler';
import Announcement from '../models/Announcement.js';

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const announcement = new Announcement({
    admin: req.user._id,
    title,
    content,
  });

  const createdAnnouncement = await announcement.save();
  res.status(201).json(createdAnnouncement);
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find({})
    .populate('admin', 'username')
    .populate('replies.user', 'username')
    .sort({ createdAt: -1 });

  res.json(announcements);
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (announcement) {
    await Announcement.deleteOne({ _id: announcement._id });
    res.json({ message: 'Announcement removed' });
  } else {
    res.status(404);
    throw new Error('Announcement not found');
  }
});

// @desc    Add a reply to an announcement
// @route   POST /api/announcements/:id/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    res.status(400);
    throw new Error('Reply comment is required');
  }

  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  const reply = {
    user: req.user._id,
    comment,
  };

  announcement.replies.push(reply);
  await announcement.save();

  const populatedAnnouncement = await Announcement.findById(req.params.id).populate('replies.user', 'username');

  res.status(201).json(populatedAnnouncement.replies);
});

export { createAnnouncement, getAnnouncements, deleteAnnouncement, addReply };

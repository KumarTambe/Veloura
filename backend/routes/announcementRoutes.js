import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  addReply,
} from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAnnouncements)
  .post(protect, admin, createAnnouncement);

router.route('/:id')
  .delete(protect, admin, deleteAnnouncement);

router.route('/:id/reply')
  .post(protect, addReply);

export default router;

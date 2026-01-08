import express from 'express';
import { getTodaysNotifications, markAsRead } from '../controllers/notification.js';

const router = express.Router();

router.get('/:uid', getTodaysNotifications);

router.put('/:notificationId/read', markAsRead);

export default router;

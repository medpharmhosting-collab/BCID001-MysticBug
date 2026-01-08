import { Notification } from '../models/Notification.js';

export const getTodaysNotifications = async (req, res) => {
  try {
    const { uid } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notifications = await Notification.find({
      userId: uid,
      createdAt: { $gte: today }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications: notifications || []
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a notification
export const createNotification = async (userId, role, type, message) => {
  try {
    const notification = new Notification({
      userId,
      role,
      type,
      message
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

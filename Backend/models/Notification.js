import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor']
  },
  type: {
    type: String,
    required: true,
    enum: ['profile_added', 'profile_updated', 'appointment_booked', 'appointment_confirmed', 'appointment_rejected', 'new_appointment']
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);

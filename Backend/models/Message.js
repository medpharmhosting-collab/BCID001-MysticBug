import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    index: true
  },
  senderName: {
    type: String,
  },
  senderRole: {
    type: String,
    enum: ['patient', 'doctor'],

  },
  receiverId: {
    type: String,
    index: true
  },
  receiverName: {
    type: String,
  },
  receiverRole: {
    type: String,
    enum: ['patient', 'doctor'],
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ receiverId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });
export const Message = mongoose.model('Message', messageSchema);

import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  patientName: {
    type: String,
    trim: true,
    default: 'Anonymous'
  },
  patientEmail: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  disLikes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  dislikedBy: {
    type: [String],
    default: []
  },
}, {
  timestamps: true
});

// Index for faster queries by doctor
feedbackSchema.index({ doctor: 1 });

// Virtual field to format date
feedbackSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString();
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    default: null
  },
  userType: {
    type: String,
    required: true,
    enum: ["patient", "doctor", "investor", "admin"],
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isProfileAdded: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null
  },
  allowLogin: {
    type: Boolean,
    default: false
  },
  authProvider: {
    type: String,
    enum: ["mobile", "email", "google"],
    default: "email"
  },
  // Doctor-specific fields (only populated when userType === 'doctor')
  specialization: { type: String },
  qualification: { type: String },
  designation: { type: String },
  typeOfDoctor: { type: String },
  specialistDetails: { type: String },
  experience: { type: String },
  rating: { type: Number, default: 0 },
  availableSlots: {
    type: [String],
    default: []
  },
  // Patient-specific fields (only when userType === 'patient')
  medicalHistory: { type: String },

  // Investor-specific (only when userType === 'patient')
  income: {
    type: Number,
    default: 0,
  },
  expense: {
    type: Number,
    default: 0,
  },
  profits: {
    type: Number,
    default: 0,
  },
  roi: {
    type: Number,
    default: 0,
  },
  equityValuation: {
    type: Number,
    default: 0,
  },
  profitability: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});
userSchema.index({ phoneNumber: 1 })
userSchema.index({ uid: 1 })
userSchema.index({ email: 1 })
export const User = mongoose.model("User", userSchema);

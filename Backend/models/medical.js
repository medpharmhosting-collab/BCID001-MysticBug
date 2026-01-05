import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  email: {
    type: String
    // Using it when patient uploads records themselves
  },
  fileName: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ["patient", "doctor"],
    required: true
  },
  doctorName: {
    type: String
  },
  medication: {
    type: String,
  },
  notes: {
    type: String,
  },
  type: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

medicalSchema.index({ uid: 1, createdAt: -1 });

export const MedicalRecord = mongoose.model("MedicalRecord", medicalSchema);
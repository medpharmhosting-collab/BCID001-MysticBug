
import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  doctorName: {
    type: String
  },
  medication: {
    type: String,
    required: true
  },
  notes: { type: String },
  pdfUrl: { type: String, required: true },
  fileName: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Prescription = mongoose.model('Prescription', PrescriptionSchema);
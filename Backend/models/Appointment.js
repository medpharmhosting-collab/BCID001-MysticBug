import mongoose from "mongoose";
const AppointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    default: ''
  },
  patientId: {
    type: String,
  },
  age: {
    type: Number,
  },
  reason: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  consultationType: {
    type: String,
    enum: ['in_person', 'telemedicine'],
    default: 'in_person'
  },
  doctorId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Appointment = mongoose.model('Appointment', AppointmentSchema);

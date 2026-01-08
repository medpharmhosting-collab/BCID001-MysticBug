import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  fullName: String,
  phoneNumber: String,
  email: String,
  medicalHistory: String,
  previousHospitalizations: String,
  allergies: String,
  age: String,
  dateOfBirth: String,
  gender: String,
  oxymeterHeartbeat: String,
  bloodType: String,
  height: String,
  weight: String,
  bloodPressure: String,
  diabetes: String,
  existingInsurance: String,
  country: String,
  state: String,
  city: String,
  street: String,
});

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
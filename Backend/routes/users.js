import express from "express";
import { User } from "../models/user.js";
import { Appointment } from "../models/Appointment.js";
import jwt from "jsonwebtoken";
import {
  getUserRole, getUsers, registerUser, setActive,
  loginUser,
  socialLogin,
  createUserProfile,
  getUserProfile, updateUserProfile,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  deletePatientById
} from "../controllers/users.js";

export const usersRoutes = express.Router();
export const patientRoutes = express.Router();
export const getCount = express.Router();

// --- Register User ---
usersRoutes.post('/register', registerUser)
// login user
usersRoutes.post('/login', loginUser)
usersRoutes.post('/social-login', socialLogin);
// forget password
usersRoutes.post('/auth/forgot-password/send-otp', sendForgotPasswordOtp);
usersRoutes.post('/auth/forgot-password/verify-otp', verifyForgotPasswordOtp);
usersRoutes.post('/auth/forgot-password/reset', resetPassword)

// --- Get User Role ---
usersRoutes.get("/getUserRole", getUserRole);
usersRoutes.post('/profile/:uid', createUserProfile)
usersRoutes.get('/profile/:uid', getUserProfile)
usersRoutes.patch('/profile/:uid', updateUserProfile)
patientRoutes.delete('/delete_patient/:id', deletePatientById)

// sign up using mobile
// --- Patient Routes ---                                         
patientRoutes.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const cleanMobile = String(mobile).replace(/\D/g, "");

  try {
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number"
      });
    }

    // Send OTP via 2Factor 
    const otpUrl = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${cleanMobile}/AUTOGEN`;

    const response = await fetch(otpUrl);
    const data = await response.json();


    if (data.Status === "Success") {
      return res.status(200).json({
        success: true,
        sessionId: data.Details,
        message: "OTP sent successfully"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: data.Details || "Failed to send OTP",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
});

patientRoutes.post("/verify-otp-and-register", async (req, res) => {
  const { otp, sessionId, mobile, name, userType } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Invalid name" });
  }
  const cleanMobile = String(mobile).replace(/\D/g, "");

  try {
    // Verify OTP with 2Factor
    const verifyUrl = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

    const response = await fetch(verifyUrl);
    const data = await response.json();

    if (data.Status !== "Success") {
      return res.status(400).json({
        success: false,
        message: data.Details || "Invalid OTP. Please try again."
      });
    }

    // OTP verified! Now check if user exists
    let user = await User.findOne({ phoneNumber: cleanMobile });

    if (!user) {
      // Generate unique UID for new user
      const uid = `${cleanMobile}_${Date.now()}`;
      const tempEmail = `${cleanMobile}@temp.com`;

      // Create new user
      user = await User.create({
        uid,
        name,
        phoneNumber: cleanMobile,
        email: tempEmail,
        userType: userType || "patient",
        isActive: true,
      });
    } else {
      user.isActive = true;
      user.name = name;
      await user.save();
    }
    const token = jwt.sign(
      {
        uid: user.uid,
        userType: user.userType
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        uid: user.uid,
        name: user.name,
        mobile: user.phoneNumber,
        userType: user.userType,
        isProfileAdded: false,
        gender: ""
      }
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Verification failed"
    });
  }
});

// Set user active status
usersRoutes.patch("/set-active", setActive);

patientRoutes.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const patient = await Appointment.findOne({ patientId: uid });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.log("Error fetching patient by id:", error);
    res.status(500).json({ message: 'Server error' });
  }
})
getCount.get('/get_count', async (req, res) => {
  try {
    const doctorCount = await User.countDocuments({ userType: 'doctor' });
    const patientCount = await User.countDocuments({ userType: 'patient' });

    const activeDoctors = await User.countDocuments({ userType: 'doctor', isActive: true });
    const activePatients = await User.countDocuments({ userType: 'patient', isActive: true });
    const activeInvestor = await User.countDocuments({ userType: 'investor', isActive: true });
    const totalCount = (await User.find()).length;

    res.status(200).json(
      {
        doctorCount: doctorCount,
        patientCount: patientCount,
        totalCount: totalCount,
        activeDoctors: activeDoctors,
        activePatients: activePatients,
        activeInvestor: activeInvestor
      })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
})

// users routes 
usersRoutes.get('/', getUsers)

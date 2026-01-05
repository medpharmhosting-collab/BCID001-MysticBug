import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import axios from "axios"
import jwt from "jsonwebtoken"
import { UserProfile } from "../models/userProfile.js";
import validator from "validator";
// ===== SIGN UP (Register New User) =====
export const registerUser = async (req, res) => {
  const { email, password, userType, name, phoneNumber } = req.body;
  try {
    // Validate required fields
    if (!email || !password || !userType || !name) {
      return res.status(400).json({
        message: "Missing required fields: email, password, userType, and name",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        ...(phoneNumber ? [{ phoneNumber }] : [])
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists. Please login instead.",
      });
    }
    // Only patients can self-register
    if (userType !== "patient") {
      return res.status(403).json({
        message: `${userType} accounts must be created by admin. Please contact administrator.`,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new patient with optimized defaults
    const uid = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newUser = new User({
      uid,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
      userType,
      name,
      isActive: true,
      allowLogin: true,
      isProfileAdded: false,
      gender: null,
      authProvider: "email"
    });

    // Save user and generate token in parallel
    const [savedUser] = await Promise.all([
      newUser.save()
    ]);

    // Generate JWT token
    const token = jwt.sign(
      { uid: savedUser.uid, userType: savedUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        uid: savedUser.uid,
        email: savedUser.email,
        name: savedUser.name,
        userType: savedUser.userType,
        allowLogin: savedUser.allowLogin,
        isProfileAdded: savedUser.isProfileAdded,
        gender: null,
        phoneNumber: savedUser.phoneNumber || ""
      },
      token,
      isNewUser: true
    });

  } catch (err) {
    console.error("Registration error:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        message: `This ${field} is already registered.`,
      });
    }

    res.status(500).json({
      message: "Server error during registration",
      error: err.message
    });
  }
};
// ===== LOGIN (Authenticate Existing User) =====
export const loginUser = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    if (!email || !password || !userType) {
      return res.status(400).json({
        message: "Missing required fields: email, password, and userType",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up first or contact admin if you're a doctor/investor.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check if user type matches
    if (user.userType !== userType) {
      return res.status(403).json({
        message: `You are registered as a ${user.userType}. Please use the ${user.userType} login.`,
      });
    }

    // Check if login is allowed (for doctors/investors)
    if ((userType === "doctor" || userType === "investor") && !user.allowLogin) {
      return res.status(403).json({
        message: "Your account is not approved yet. Please contact the admin.",
      });
    }

    const token = jwt.sign(
      { uid: user.uid, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    if (!user.isActive) {
      User.findByIdAndUpdate(user._id, { isActive: true }).catch(err =>
        console.error("Failed to update user active status:", err)
      );
    }

    // Normalize profile flag based on role
    const isProfileAdded = (user.userType === "admin" || user.userType === "investor")
      ? false
      : user.isProfileAdded;

    return res.status(200).json({
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        userType: user.userType,
        allowLogin: user.allowLogin,
        isProfileAdded: isProfileAdded,
        gender: user.gender || "",
        phoneNumber: user.phoneNumber || ""
      },
      token,
      isNewUser: false
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error during login",
      error: err.message
    });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userType: user.userType,
      name: user.name,
      email: user.email,
      allowLogin: user.allowLogin,
      isProfileAdded: user.isProfileAdded,
      gender: user.gender
    });
  } catch (err) {
    console.error("Error fetching user role:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}
export const createUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const {
      fullName,
      email,
      medicalHistory,
      previousHospitalizations,
      allergies,
      age,
      dateOfBirth,
      gender,
      oxymeterHeartbeat,
      bloodType,
      height,
      weight,
      address,
      bloodPressure,
      diabetes,
      existingInsurance
    } = req.body;
    if (!gender) {
      return res.status(400).json({ message: "gender are required" });
    }
    if (!uid) return res.status(400).json({ message: "Missing uid" });

    const profile = await UserProfile.findOneAndUpdate(
      { uid },
      {
        uid, fullName, email, medicalHistory, previousHospitalizations, allergies, age, dateOfBirth, gender, oxymeterHeartbeat, bloodType, height, weight, address, bloodPressure,
        diabetes, existingInsurance
      },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate({ uid }, { isProfileAdded: true, gender, phoneNumber: req.body.phoneNumber });

    return res.status(200).json({ message: "Profile saved", profile });
  } catch (error) {
    console.error("userProfile error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ message: "Missing uid" });

    const profile = await UserProfile.findOne({ uid });
    if (!profile) {
      return res.status(200).json({ profile: {} });
    }
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ message: "Missing uid" });

    const profile = await UserProfile.findOneAndUpdate(
      { uid },
      { $set: req.body },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: "Profile updated successfully", profile });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const deletePatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findOneAndDelete({ _id: id, userType: "patient" })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "patient not found" });
    }
    res.status(200).json({ success: true, message: "patient deleted successfully" })
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// ===== GOOGLE/APPLE LOGIN (Social Auth) =====
export const socialLogin = async (req, res) => {
  const { uid, email, userType, name } = req.body;

  try {
    if (!uid || !email || !userType) {
      return res.status(400).json({
        message: "Missing required fields: uid, email, and userType",
      });
    }

    // Find existing user by uid or email
    let user = await User.findOne({ email })


    // Existing user
    if (user) {
      // Check user type match
      if (user.userType !== userType) {
        return res.status(403).json({
          message: `You are registered as a ${user.userType}. Please use the ${user.userType} login.`,
        });
      }

      // Check allowLogin for doctors/investors
      if ((userType === "doctor" || userType === "investor") && !user.allowLogin) {
        return res.status(403).json({
          message: "Your account is not approved yet. Please contact the admin.",
        });
      }

      const token = jwt.sign(
        { uid: user.uid, userType: user.userType },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      if (!user.isActive) {
        User.findByIdAndUpdate(user._id, { isActive: true }).catch(err =>
          console.error("Failed to update user active status:", err)
        );
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name,
          userType: user.userType,
          isProfileAdded: user.isProfileAdded || false,
          gender: user.gender || "",
          phoneNumber: user.phoneNumber || ""
        },
        token,
        isNewUser: false
      });
    }

    // New user
    // Only patients can register via social login
    if (userType !== "patient") {
      return res.status(403).json({
        message: `${userType} accounts must be created by admin. Please contact administrator.`,
      });
    }

    const newUser = new User({
      uid: uid,
      email,
      userType,
      name: name || "Patient",
      isActive: true,
      allowLogin: true,
      password: null,
      isProfileAdded: false,
      gender: null,
      authProvider: "google"
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { uid: savedUser.uid, userType: savedUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        uid: savedUser.uid,
        email: savedUser.email,
        name: savedUser.name,
        userType: savedUser.userType,
        isProfileAdded: false,
        gender: null,
        phoneNumber: savedUser.phoneNumber || ""
      },
      token,
      isNewUser: true
    });
  } catch (err) {
    console.error("Social login error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

export const setActive = async (req, res) => {
  try {
    const { uid, isActive } = req.body;

    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: "User status updated",
      user: {
        uid: user.uid,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json("server error")
  }
}

export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { mobile, userType } = req.body;
    console.log("api called")
    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // Check user exists by phoneNumber
    const user = await User.findOne({ phoneNumber: mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "exist User not registered with this mobile number"
      });
    }

    // Check user type matches
    if (user.userType !== userType) {
      return res.status(404).json({
        success: false,
        message: "User not registered with this mobile number"
      });
    }

    if (user.userType !== userType && !user.password) {
      return res.status(403).json({
        success: false,
        message: "Password reset not available for this account."
      });
    }

    const cleanMobile = mobile.replace(/^91/, "");
    const otpUrl = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${cleanMobile}/AUTOGEN`;

    const response = await axios.get(otpUrl);

    if (response.data.Status !== "Success") {
      return res.status(400).json({
        success: false,
        message: "OTP sending failed"
      });
    }

    return res.json({
      success: true,
      sessionId: response.data.Details,
      uid: user.uid
    });

  } catch (err) {
    console.error("Forgot password OTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { sessionId, otp, uid } = req.body;

    if (!sessionId || !otp || !uid) {
      return res.status(400).json({ message: "Missing data" });
    }

    const verifyUrl =
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

    const response = await axios.get(verifyUrl);

    if (response.data.Status !== "Success") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Create reset token (10 min) with uid
    const resetToken = jwt.sign(
      { sessionId, uid },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({
      success: true,
      resetToken
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({ message: "Missing data" });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const { uid } = decoded;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

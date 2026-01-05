import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";
import { images } from "../assets/assets";
const VerifyAndNewPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { sessionId, uid, mobile, userType } = state || {};

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("otp");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!sessionId || !mobile) {
      navigate("/forgot-password", { replace: true });
    }
  }, [sessionId, mobile, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    setError(null);
    if (otp.length !== 6) return setError("Invalid OTP");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, otp, uid }),
      });

      const data = await res.json();

      if (data.success) {
        setResetToken(data.resetToken);
        setStep("password");
      } else {
        setError(data.message);
      }
    } catch {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          password
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password reset successfully");
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setResending(true);

    try {
      const res = await fetch(`${BASE_URL}/users/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          userType: userType || "patient"
        }),
      });
      const data = await res.json();

      if (data.success) {
        setTimer(60);
        setOtp("");
        alert("OTP resent successfully!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };
  const handleOtpChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }
  }
  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <img
        src={images.upper_clip}
        alt="clip"
        className="absolute top-0 pointer-events-none h-[500px] w-[1120px]"
      />

      <div className="flex h-full items-center justify-center px-4 sm:px-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-5xl">
          {step === "otp" && (
            <>
              <div className="w-full md:w-1/2 text-center space-y-6 sm:mt-14">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  VERIFY OTP
                </h1>

                <p className="text-gray-600 text-lg">
                  Enter the 6-digit OTP sent to
                  <br />
                  <span className="font-semibold">+91 {mobile}</span>
                </p>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    disabled={loading}
                    className="w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#0A4F5B] text-lg text-center tracking-widest disabled:bg-gray-100"
                  />
                </div>

                <button
                  className="bg-[#0A4F5B] text-white w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#083d47] transition mx-auto"
                  disabled={otp.length !== 6 || loading}
                  onClick={handleVerifyOtp}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="flex flex-col items-center gap-2 mt-4">
                  <p className="text-sm text-gray-600">
                    Didn't receive the OTP?
                  </p>

                  {timer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {timer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={resending}
                      className="text-[#0A4F5B] font-medium hover:underline disabled:opacity-50"
                    >
                      {resending ? "Resending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate("/forgot-password", { state: { userType } })
                  }
                  className="text-sm text-gray-600 hover:text-gray-800 mt-2"
                >
                  ← Change Mobile Number
                </button>
              </div>

              <img
                src={images.otp_man}
                alt="otp illustration"
                className="hidden sm:block w-[300px] lg:w-[450px] object-contain mb-8 md:mb-0"
              />
            </>
          )}
          {step === "password" && (
            <>
              <div className="w-full md:w-1/2 text-center space-y-6 sm:mt-14">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  SET NEW PASSWORD
                </h1>

                <p className="text-gray-600 text-lg">
                  Create a new password for your account
                </p>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center gap-4 mt-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#0A4F5B] text-lg disabled:bg-gray-100"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#0A4F5B] text-lg disabled:bg-gray-100"
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="bg-[#0A4F5B] text-white w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded mt-4 hover:bg-[#083d47] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Setting Password..." : "Set New Password"}
                </button>
              </div>

              <img
                src={images.otp_man}
                alt="otp illustration"
                className="hidden sm:block w-[300px] lg:w-[450px] object-contain mb-8 md:mb-0"
              />
            </>
          )}

        </div>
      </div>


      <img
        src={images.lower_clip}
        alt="clip bottom"
        className="absolute h-[550px] bottom-[-50px] sm:bottom-0 right-0 w-[500px] sm:w-[1000px] pointer-events-none z-0"
      />
    </div>
  );
};

export default VerifyAndNewPassword;

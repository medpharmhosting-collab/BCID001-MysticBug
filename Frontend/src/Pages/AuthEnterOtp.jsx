import { useState, useEffect } from "react";
import { images } from ".././assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { BASE_URL } from "../config/config.js"

const AuthEnterOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, mobile, name, userType } = location?.state || {};
  const { manualLogin } = useAuth();

  // Redirect if no required data provided
  useEffect(() => {
    if (!sessionId || !mobile || !name) {
      navigate("/auth-enter-mobile", { state: { userType: userType || "patient" } });
    }
  }, [sessionId, mobile, name, userType, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/patient/verify-otp-and-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          sessionId,
          mobile,
          name,
          userType: userType || "patient"
        })
      });

      const data = await res.json();
      console.log("data after verifying otp:", data)
      if (data.success) {
        // Login successful 
        manualLogin(
          data.user.uid,
          data.user.name,
          data.user.userType,
          data.token,
          data.user.isProfileAdded,
          data.user.gender
        );

        // Navigation will be handled by AuthContext
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setResending(true);

    try {
      const res = await fetch(`${BASE_URL}/patient/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }), // Only mobile!
      });

      const data = await res.json();

      if (data.success) {
        // Update state with new sessionId
        navigate('/auth-enter-otp', {
          state: {
            sessionId: data.sessionId,
            mobile,
            name,
            userType
          },
          replace: true
        });
        setTimer(60); // Reset timer
        setOtp(""); // Clear OTP field
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
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <img
        src={images.upper_clip}
        alt="clip"
        className='absolute top-0 pointer-events-none h-[500px] w-[1120px]' />

      <div className="flex h-full items-center justify-center px-4 sm:px-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-5xl">
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
              onClick={handleVerifyOTP}
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
                navigate("/auth-enter-mobile", { state: { userType } })
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

export default AuthEnterOTP;
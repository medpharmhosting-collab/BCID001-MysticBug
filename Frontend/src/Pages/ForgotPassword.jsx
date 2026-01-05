import { useState } from "react";
import { images } from ".././assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/config.js"

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { userType: stateUserType } = location?.state || {};
  const urlParams = new URLSearchParams(location.search);
  const userType = urlParams.get('userType') || stateUserType || localStorage.getItem('forgotUserType') || 'patient';
  console.log("urlparams:", urlParams)
  console.log("usertype:", userType)
  const handleSendOtp = async () => {
    setError(null);
    console.log("inside handlesendotp")
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          userType: userType
        }),
      });

      const data = await res.json();

      if (data.success) {
        navigate("/verify-reset-password", {
          state: {
            sessionId: data.sessionId,
            uid: data.uid,
            mobile,
            userType: userType || "patient"
          }
        });
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <img
        src={images.upper_clip}
        alt="clip"
        className="absolute top-0 pointer-events-none h-[500px] w-[1120px]"
      />

      <div className="flex h-full items-center justify-center px-4 sm:px-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-5xl">
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              ENTER MOBILE NUMBER
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Enter the Mobile Number to receive OTP
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 items-center md:items-start mt-4">
              <div className="w-[280px] sm:w-72 md:w-64 flex items-center border border-gray-300 rounded focus-within:border-[#0A4F5B]">
                <span className="px-3 text-gray-600 text-lg">+91</span>
                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  disabled={loading}
                  className="flex-1 w-full px-2 py-3 rounded-r focus:outline-none text-lg"
                />
              </div>
            </div>

            <button
              className="bg-[#0A4F5B] text-white w-[280px] sm:w-72 md:w-64 px-4 py-3 rounded mt-4 hover:bg-[#083d47] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={mobile.length !== 10 || loading}
              onClick={handleSendOtp}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;

import { useState } from "react";
import { images } from ".././assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/config.js"

const AuthEnterMobile = () => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = location?.state || {};
  const handleSendOtp = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/patient/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        navigate('/auth-enter-otp', {
          state: {
            sessionId: data.sessionId,
            mobile,
            name,
            userType: userType || "patient"
          }
        });
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50">
      <img
        src={images.upper_clip}
        alt="clip"
        className='absolute top-0 pointer-events-none h-[500px] w-[1120px]' />

      <div className="flex min-h-screen items-center justify-center px-4 sm:px-10 py-6 sm:py-0">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-5xl">
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              ENTER MOBILE NUMBER
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Enter the Mobile Number to receive OTP
            </p>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="w-full max-w-[320px] sm:max-w-72 md:max-w-64 flex flex-col gap-3 mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded border border-gray-300 focus:border-[#0A4F5B] focus:ring-1 focus:ring-[#0A4F5B]/30 focus:outline-none text-lg"
              />

              <div className="w-full flex items-stretch border border-gray-300 rounded focus-within:border-[#0A4F5B] focus-within:ring-1 focus-within:ring-[#0A4F5B]/30">
                <span className="flex items-center px-3 text-gray-600 text-lg border-r border-gray-300">
                  +91
                </span>

                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  disabled={loading}
                  className="w-full px-3 py-3 text-lg focus:outline-none bg-transparent"
                />
              </div>

            </div>

            <button
              className="bg-[#0A4F5B] text-white w-full max-w-[320px] sm:w-72 md:w-64 px-4 py-3 rounded mt-4 hover:bg-[#083d47] transition disabled:bg-gray-400 disabled:cursor-not-allowed mx-auto md:mx-0"
              disabled={mobile.length !== 10 || !name.trim() || loading}
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

export default AuthEnterMobile;
import { useState } from 'react'
import { icons, images } from '../../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import { firebaseAuth, useAuth } from '../../Context/AuthContext'
import { BASE_URL } from "../../config/config.js"

const DoctorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eye, setEye] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const { userType } = location?.state || { userType: 'doctor' };

  const {
    firebaseSocialSignIn,
    manualLogin,
    shouldNavigateToRole, authSource
  } = useAuth();

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)

    try {
      // Set authSource BEFORE making backend call to prevent race conditions
      authSource.current = "backend";

      // Call backend login endpoint
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      manualLogin(data.user.uid, data.user.name, data.user.userType, data.token, false, data.user.gender);

    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Login failed. Please try again.")
      authSource.current = null; // Reset on error
    } finally {
      setLoading(false)
    }
  }

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      const { fbUid, fbEmail, fbName } = await firebaseSocialSignIn("google");

      // Set authSource BEFORE making backend call
      authSource.current = "backend";

      // Call social login endpoint
      const response = await fetch(`${BASE_URL}/users/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: fbUid,
          email: fbEmail,
          userType,
          name: fbName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed")
      }

      manualLogin(data.user.uid, data.user.name, data.user.userType, data.token, false, data.user.gender);

    } catch (error) {
      console.error("Google login error:", error)
      setError(error.message || "Google login failed. Please try again.")
      authSource.current = null; // Reset on error

      // Clean up on error
      if (firebaseAuth.currentUser) {
        try {
          await firebaseAuth.signOut();
        } catch (e) { }
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Apple Login
  const handleAppleLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      const { fbUid, fbEmail, fbName } = await firebaseSocialSignIn("apple");

      // Set authSource BEFORE making backend call
      authSource.current = "backend";

      // Call social login endpoint
      const response = await fetch(`${BASE_URL}/users/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: fbUid,
          email: fbEmail,
          userType,
          name: fbName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Apple login failed")
      }

      manualLogin(data.user.uid, data.user.name, data.user.userType, data.token, false, data.user.gender);

    } catch (error) {
      console.error("Apple login error:", error)
      setError(error.message || "Apple login failed. Please try again.")
      authSource.current = null; // Reset on error

      // Clean up on error
      if (firebaseAuth.currentUser) {
        try {
          await firebaseAuth.signOut();
        } catch (e) { }
      }
    } finally {
      setLoading(false)
    }
  }
  const handleForgotPasswordClick = () => {
    localStorage.setItem('forgotUserType', userType || "doctor");
    navigate('/forgot-password?userType=' + (userType || "doctor"))
  }
  return (
    <div className='relative overflow-hidden h-screen'>
      <img
        src={images.upper_clip}
        alt="clipImage"
        className='absolute top-0 pointer-events-none h-[500px] w-[1120px]' />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:justify-start px-4 sm:px-6">
        <div className="relative z-10 max-w-sm sm:max-w-2xl w-full mt-12 px-2 sm:px-28">
          <div className="text-start">
            <h1 className="font-merriweather font-bold text-48 text-[#1B1B1B]">
              Doctor Log In
            </h1>
            <p className="font-lato font-normal text-xs sm:text-base sm:p-2 mb-2 sm:whitespace-nowrap">
              Your Expertise Saves Lives. We're Honored to Support You <span className='inline-flex items-center text-green-700'><icons.FaLeaf className='text-green-700' /></span>
            </p>
            {error && <div className="bg-[#F6B7AC] border border-red-100 text-black rounded mb-4">
              <p className="text-center p-1 sm:p-2">{error}</p>
            </div>
            }
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-1.5 relative z-20">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-teal-700 mb-1"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eg. johndoe@example.com"
                  className="w-full px-3 py-2.5 sm:py-3 border border-teal-600 rounded-none focus:outline-none focus:border-teal-700 text-gray-700 text-sm sm:text-base"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-teal-700 mb-1"
                >
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={eye ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2.5 sm:py-3 border border-teal-600 rounded-none focus:outline-none focus:border-teal-700 text-gray-700 text-sm sm:text-base"
                    disabled={loading}
                  />
                  <span
                    className="absolute right-3 top-1/4 cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => setEye(!eye)}
                  >
                    {eye ? <icons.FaRegEyeSlash size={18} /> : <icons.FaRegEye size={18} />}
                  </span>
                </div>
                <div className="text-right mt-0.5">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-teal-600 hover:text-teal-700 underline text-xs"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 text-white py-2.5 sm:py-3 hover:bg-teal-800 transition duration-200 font-medium text-sm sm:text-base relative z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>

              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
                className="w-full border border-gray-900 text-gray-700 py-2.5 sm:py-3 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 relative z-20 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <icons.FaGoogle size={16} />
                <span>Log in With Google</span>
              </button>

              <button
                onClick={handleAppleLogin}
                type="button"
                disabled={loading}
                className="w-full border border-gray-900 text-gray-700 py-2.5 sm:py-3 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 relative z-20 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <icons.FaApple size={18} />
                <span>Log in with Apple ID</span>
              </button>

            </form>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <img
            src={images.Doctor}
            alt="Doctor image"
            className="w-[300px] lg:w-[400px] object-contain"
          />
        </div>
      </div>

      <img
        src={images.lower_clip}
        alt="clipImage"
        className="absolute h-[550px] bottom-[-50px] sm:bottom-0 right-0 w-[500px] sm:w-[1000px] pointer-events-none z-0"
      />
    </div >
  )
}

export default DoctorLogin

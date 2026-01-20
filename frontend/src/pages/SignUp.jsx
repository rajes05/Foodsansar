import React, { useState } from "react";
import { FaEye } from "react-icons/fa"; // Eye icon
import { FaEyeSlash } from "react-icons/fa"; // Eye slash icon
import { FcGoogle } from "react-icons/fc"; // Google icon
import { useNavigate } from "react-router-dom"; // Navigation hook
import axios from "axios"; // HTTP client
import { serverUrl } from "../App.jsx"; // Importing server URL
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners"; // for loading spinner
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";


function SignUp() {
  const primaryColor = "#ff4d2d";
  // const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState(""); // to show error messages
  const [loading, setLoading] = useState(false); // to show loading state
  const dispatch = useDispatch(); // to dispatch actions

  // OTP related states
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Handle Functions

  const handleSignUp = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErr("Invalid email format");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      setErr("Password must be at least 6 characters long and contain at least one number and one special character");
      setLoading(false);
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setErr("Mobile number must be exactly 10 digits");
      setLoading(false);
      return;
    }
    try {
      // const result = await axios.post(`${serverUrl}/api/auth/signup`, { ... });
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        fullName,
        email,
        password,
        mobile,
        role,
      }); // Removed withCredentials as cookies are not set here anymore

      // If successful, backend sends { message: "OTP sent...", user: ... }
      // We don't login yet. We show OTP input.
      setShowOtpInput(true);
      setErr(""); // clear error message
      setLoading(false);

    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-registration`, {
        email,
        otp
      }, { withCredentials: true });

      // Verification successful, now we are logged in
      dispatch(setUserData(result?.data?.user ?? result?.data));
      setErr("");
      setVerifyLoading(false);
      navigate("/"); // Redirect to home/dashboard
    } catch (error) {
      setErr(error?.response?.data?.message);
      setVerifyLoading(false);
    }
  }

  const handleGoogleAuth = async () => {
    // if (!mobile) {
    //   return setErr("mobile no is required");
    // }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // fetch user info from result
    try {
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: result.user.displayName,
        email: result.user.email,
        mobile,
        role,
      },
        { withCredentials: true });

      dispatch(setUserData(data?.user ?? data));

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >

      {/* signup form */}

      <div
        className={`bg-white rounded-xl shadow-lg w-ful max-w-md p-8 border`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          FoodSansar
        </h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started with delicious food deliverires
        </p>

        {/* fullName */}

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter Your Full Name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setFullName(e.target.value)}
            value={fullName} required
          />
        </div>

        {/* E-mail */}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            E-mail
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter Your E-mail"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setEmail(e.target.value)}
            value={email} required
          />
        </div>

        {/* mobile */}

        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="mobile"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter Your Mobile Number"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setMobile(e.target.value)}
            value={mobile} required
          />
        </div>

        {/* password */}

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Enter Your Password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => setPassword(e.target.value)}
              value={password} required
            />
            <button className="absolute right-3 cursor-pointer top-3.5 text-gray-500" onClick={() => setShowPassword(prev => !prev)}>
              {!showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* role */}

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
                onClick={() => setRole(r)}
                style={
                  role == r ?
                    { backgroundColor: primaryColor, color: "white" }
                    : { border: `1px solid ${primaryColor}`, color: primaryColor }
                }
              >{r}</button>
            ))}
          </div>
        </div>

        {/* signup button */}

        {/* buttons: Either Sign Up or Verify OTP */}

        {!showOtpInput ? (
          <button className="cursor-pointer w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]" onClick={handleSignUp} disabled={loading}>
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter 4-digit OTP"
                style={{ border: `1px solid ${borderColor}` }}
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
              <p className="text-sm text-gray-500 mt-1">OTP sent to {email}</p>
            </div>

            <button className="cursor-pointer w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]" onClick={handleVerifyOtp} disabled={verifyLoading}>
              {verifyLoading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>

            <button className="cursor-pointer w-full font-semibold border rounded-lg py-2 transition duration-200 text-gray-600 hover:bg-gray-100" onClick={() => setShowOtpInput(false)}>
              Back to Registration
            </button>
          </div>
        )}

        {/* show error message */}

        {err && <p className="text-red-500 text-center my-2.5">*{err}</p>}

        {/* google sign up button */}
        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer' onClick={handleGoogleAuth}>
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>

        </button>

        <p className="text-center mt-6 cursor-pointer" onClick={() => navigate("/signin")}>Already have an account ? <span className="text-[#ff4d2d]">Sign In</span></p>
        {/* Back to Home */}
        <button
            onClick={() => navigate('/landing-page')}
            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Back to Home
          </button>
      </div>

    </div>
  );
}

export default SignUp;

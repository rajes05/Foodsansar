import React, { useState } from "react";
import { FaEye } from "react-icons/fa"; // Eye icon
import { FaEyeSlash } from "react-icons/fa"; // Eye slash icon
import { FcGoogle } from "react-icons/fc"; // Google icon
import { useNavigate } from "react-router-dom"; // Navigation hook
import axios from "axios"; // HTTP client
import { serverUrl } from "../App.jsx"; // Importing server URL
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";


function SignIn() {
  const primaryColor = "#ff4d2d";
  // const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); // to show error messages
  const [loading, setLoading] = useState(false); // to show loading state
  const dispatch = useDispatch(); // to dispatch actions

  // Handle Functions

  const handleSignIn = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErr("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email,
        password,
      }, { withCredentials: true }); // added withCredentials to include cookies

      // prefer "user" key if backend returns it, otherwise fallback to wholre result.data

      dispatch(setUserData(result?.data?.user ?? result?.data));
      setErr(""); // clear error message
      setLoading(false);

    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

  const handleGoogleAuth = async () => {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // fetch user info from result
    try {
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email,
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

      {/* signin form */}

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
          Sign In to your account to get started with delicious food deliverires
        </p>

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

        {/* forgot password link */}

        <div className="text-right mb-4 text-[#ff4d2d] font-medium cursor-pointer"
          onClick={() => navigate("/forgot-password")}>
          Forgot Password ?
        </div>

        {/* signin button */}

        <button className="cursor-pointer w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]" onClick={handleSignIn} disabled={loading}>
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        {/* show error message */}

        {err && <p className="text-red-500 text-center my-2.5">*{err}</p>}

        {/* google sign in button */}
        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer'
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>

        </button>

        <p className="text-center mt-6 cursor-pointer" onClick={() => navigate("/signup")}>Want to create a new account ? <span className="text-[#ff4d2d]">Sign Up</span></p>
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

export default SignIn;

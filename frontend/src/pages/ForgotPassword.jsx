import axios from 'axios';
import React from 'react';
import { useState } from 'react'; // State hook
import { IoIosArrowRoundBack } from "react-icons/io"; // Back arrow icon
import { useNavigate } from 'react-router-dom'; // Navigation hook
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
  const [email, setEmail] = useState(""); // Email state
  const [otp, setOtp] = useState(""); // OTP state
  const [newPassword, setNewPassword] = useState(""); // New Password state 
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password state
  const navigate = useNavigate(); // Navigation hook
  const [err, setErr] = useState(""); // to show error messages
  const [loading, setLoading] = useState(false); // to show loading state


  // Handle Functions

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`,{
        email
      },
    {withCredentials:true}); // added withCredentials to include cookies
      console.log(result);
      setErr(""); // clear error message
      setStep(2); // Move to step 2
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

   const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,{
        email,
        otp,
      },
    {withCredentials:true}); // added withCredentials to include cookies
      console.log(result);
      setErr(""); // clear error message
      setStep(3); // Move to step 2
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

  const handleResetPassword = async () => {
    setLoading(true);

    // basic validation
    if(!newPassword || !confirmPassword){
      setErr("Please fill both password fields");
      setLoading(false);
      return;
    }
    if(newPassword.length < 6 ){
      setErr("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if(newPassword !== confirmPassword){
      setErr("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`,{
        email,
        newPassword,
      },
    {withCredentials:true});
     // added withCredentials to include cookies

      console.log(result);
      setErr(""); // clear error message
      setLoading(false);
      navigate("/signin"); // Redirect to sign-in page after successful password reset 

    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

  return (
    <div className='flex w-full min-h-screen items-center justify-center p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 '>

        {/* back button and title */}

        <div className='flex items-center gap-4 mb-4'>
          <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/signin")}/>
          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]' >Forgot Password</h1>
        </div>

        {/* step 1: enter email */}

        {step == 1 && 
        <div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Enter Your E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email} required
            />
          </div>

          {/* send otp button */}

          <button className=" w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer" onClick={handleSendOtp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white'/> : "Send OTP"}
          </button>

          {/* show error message */}

          {err && <p className="text-red-500 text-center my-2.5">*{err}</p>}

        </div>}

        {/* step 2: enter otp */}

         {step == 2 && 
         <div>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-gray-700 font-medium mb-1"
            >
              OTP
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp} required
            />
          </div>

          {/* verify button */}

          <button className=" w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white'/> : "Verify OTP"}
          </button>

          {/* show error message */}

          {err && <p className="text-red-500 text-center my-2.5">*{err}</p>}
        </div>}

         {/* step 3: reset password */}

         {step == 3 && 
         <div>

          {/* new password */}

          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword} required
            />
          </div>

          {/* confirm password */}

          <div className="mb-6">
            <label
              htmlFor="ConfirmPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              Confirm  Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword} required  
            />
          </div>

          {/* verify button */}

          <button className=" w-full font-semibold  border rounded-lg py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer" onClick={handleResetPassword} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white'/> : "Reset Password"}
            
          </button>

          {/* show error message */}

          {err && <p className="text-red-500 text-center my-2.5">*{err}</p>}

        </div>}

      </div>
    </div>
  )
}

export default ForgotPassword;
import express from "express";
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp, verifyRegistration } from "../controllers/auth.controllers.js";

const authRouter = express.Router(); // Create an instance of express Router


// Define routes and associate them with controller functions

authRouter.post("/signup", signUp); // Define a POST route for user sign-up
authRouter.post("/signin", signIn); // Define a POST route for user sign-in
authRouter.get("/signout", signOut); // Degine a get route for user sign-out
authRouter.post("/send-otp", sendOtp); // Define a POST route for sending OTP to user email
authRouter.post("/verify-otp", verifyOtp); // Define a POST route for verifying OTP
authRouter.post("/reset-password", resetPassword); // Define a POST route for resetting user password
authRouter.post("/google-auth", googleAuth); // Define a GET route for Google authentication
authRouter.post("/verify-registration", verifyRegistration);
export default authRouter;
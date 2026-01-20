import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but is not verified, we can resend OTP
            if (!user.isOtpVerified) {
                // Update details if needed or just resend OTP
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                user.resetOtp = otp;
                user.otpExpires = Date.now() + 5 * 60 * 1000;

                // Optional: Update other fields if user is stuck in unverified state? 
                // For now, let's just update password/mobile if they changed, or just resend.
                // Simpler: Just update the OTP.
                const hashedPassword = await bcrypt.hash(password, 10);
                user.fullName = fullName;
                user.password = hashedPassword;
                user.mobile = mobile;
                user.role = role;

                await user.save();
                await sendOtpMail(email, otp, "Account Verification OTP", "Account Verification");
                return res.status(200).json({ message: "Account exists but unverified. New OTP sent.", userExists: true });
            }
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain at least one number and one special character" });
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobile,
            role,
            resetOtp: otp,
            otpExpires: Date.now() + 5 * 60 * 1000,
            isOtpVerified: false
        });

        await sendOtpMail(email, otp, "Account Verification OTP", "Account Verification");

        return res.status(201).json({ message: "OTP sent to your email", user });

    } catch (error) {
        return res.status(500).json(`Sign up error: ${error}`);
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body; //retrieve data from request body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email }); // check if user exists

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "Please verify your email to login" });
        }
        const isMatch = await bcrypt.compare(password, user.password); // compare provided password with stored hashed password
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await genToken(user._id); // generate a JWT token for the newly created user

        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }); // parse the token in an HTTP-only cookie

        return res.status(200).json(user); // send back the created user as response

    } catch (error) {
        return res.status(500).json(`Sign In error: ${error.message}`);
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Sign out Sucessful" });
    } catch (error) {
        return res.status(500).json(`Sign out error: ${error.message}`);
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        // generate otp
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // generate a 4 digit otp
        user.resetOtp = otp;

        // expiry time 5 minutes
        user.otpExpires = Date.now() + 5 * 60 * 1000;

        user.isOtpVerified = false;
        await user.save();
        await sendOtpMail(email, otp);

        return res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        return res.status(500).json(`Send OTP error: ${error.message}`);
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified sucessfully" });

    } catch (error) {
        return res.status(500).json(`Verify OTP error: ${error.message}`)
    }
};

export const verifyRegistration = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json(`Verify Registration error: ${error.message}`);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body; // newPassword retrieved from frontend with the help of useState
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "User does not exist or OTP not verified" });
        }

        // hash the new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // update password
        user.isOtpVerified = false; // reset otp verification status
        await user.save(); // save the updated user

        return res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        return res.status(500).json(`Reset Password error: ${error.message}`);
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body;
        let user = await User.findOne({ email }); // let because we can't update or reassign in const

        // if user does not exist, create a new user
        if (!user) {
            user = await User.create({
                fullName,
                email,
                mobile,
                role,
                isOtpVerified: true
            })
        }

        // generate token for the user
        const token = await genToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(200).json(user);


    } catch (error) {
        return res.status(500).json(`Google Auth error: ${error.message}`);
    }
}
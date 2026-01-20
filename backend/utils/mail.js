import nodemailer from 'nodemailer'; // Import nodemailer for sending emails
import dotenv from 'dotenv'; // Import dotenv to manage environment variables
dotenv.config(); // Load environment variables from .env file

// Function to send an email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // your gmail address
    pass: process.env.PASS, // your gmail password or app password
  },
});

export const sendOtpMail = async (to, otp, subject = "Your OTP for Password Reset", title = "Password Reset") =>{
    transporter.sendMail({
        from: process.env.EMAIL,
        to, 
        subject: subject,
        html:`<p>Your OTP for <b>${title}</b> is <b>${otp}</b>. It expires in 5 minutes.</p>`, 
    })
}

export const sendDeliveryOtpMail = async (user, otp) =>{
    transporter.sendMail({
        from: process.send.EMAIL,
        to:user.email, 
        subject:"Delivery OTP",
        html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`, 
    })
}

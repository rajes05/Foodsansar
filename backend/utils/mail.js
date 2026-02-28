import nodemailer from 'nodemailer'; // Import nodemailer for sending emails
import dotenv from 'dotenv'; // Import dotenv to manage environment variables
dotenv.config(); // Load environment variables from .env file

// Function to send an email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_EMAIL, // your gmail address
    pass: process.env.SMTP_PASS, // your gmail password or app password
  },
});

export const sendOtpMail = async (to, otp, subject = "Your OTP for Password Reset", title = "Password Reset") => {
  transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject: subject,
    html: `<p>Your OTP for <b>${title}</b> is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  })
}

export const sendDeliveryOtpMail = async (user, otp) => {
  transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  })
}

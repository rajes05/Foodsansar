import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import connectDB from "../config/db.js";
import path from "path";
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from backend/.env (parent directory of scripts/)
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ role: "ADMIN" });

        if (adminExists) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const adminUser = new User({
            fullName: "Super Admin",
            email: "admin@foodsansar.com",
            password: hashedPassword,
            role: "ADMIN",
            status: "APPROVED",
            mobile: "0000000000",
            isOtpVerified: true
        });

        await adminUser.save();
        console.log("Super Admin created successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();

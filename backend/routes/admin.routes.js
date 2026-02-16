import express from "express";
import User from "../models/user.model.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Middleware to ensure all routes are protected and for admins only
router.use(isAuth, isAdmin);

// Helper for pagination
const paginate = async (model, query, page, limit) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        model.find(query).select("-password").skip(skip).limit(limit),
        model.countDocuments(query)
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// GET /api/admin/shops -> fetch all shops
router.get("/shops", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await paginate(User, { role: "owner" }, page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/deliveries -> fetch all delivery users
router.get("/deliveries", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await paginate(User, { role: "deliveryBoy" }, page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users -> fetch all regular users
router.get("/users", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await paginate(User, { role: { $in: ["user", "USER"] } }, page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH /api/admin/approve/:userId -> approve user
router.patch("/approve/:userId", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { status: "APPROVED" },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User approved successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH /api/admin/reject/:userId -> reject user
router.patch("/reject/:userId", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { status: "REJECTED" },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User rejected successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

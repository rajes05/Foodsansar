import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: No User ID found" });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }

        req.user = user; // Attach full user object for subsequent handlers if needed
        next();

    } catch (error) {
        return res.status(500).json({ message: `IsAdmin Error: ${error.message}` });
    }
};

export default isAdmin;

import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addReview, getItemReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/add", isAuth, addReview);
router.get("/:itemId", getItemReviews);

export default router;

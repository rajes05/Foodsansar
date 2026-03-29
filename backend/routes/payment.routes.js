import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { initiateEsewaPayment, initiateKhaltiPayment, verifyEsewaPayment, verifyKhaltiPayment } from "../controllers/payment.controllers.js";

const paymentRouter = express.Router();

// Initiate eSewa payment (requires authentication)
paymentRouter.post("/esewa/initiate", isAuth, initiateEsewaPayment);

// Verify eSewa payment callback (no auth needed as it comes from eSewa)
paymentRouter.get("/esewa/verify", verifyEsewaPayment);

// khalti
paymentRouter.post("/khalti/initiate", isAuth, initiateKhaltiPayment);
paymentRouter.get("/khalti/verify", verifyKhaltiPayment);

export default paymentRouter;

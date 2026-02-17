import crypto from "crypto";
import Order from "../models/order.model.js";

// eSewa configuration
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL;

export const initiateEsewaPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized access to order" });
        }

        if (order.paymentMethod !== "online") {
            return res.status(400).json({ message: "Order payment method is not online" });
        }

        const transactionUuid = crypto.randomUUID();

        // Update order with transaction ID
        order.payment.transactionId = transactionUuid;
        order.markModified('payment'); // Ensure mongoose detects the change
        await order.save();

        const totalAmount = order.totalAmount.toString();
        const productCode = ESEWA_MERCHANT_CODE;
        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

        const signature = crypto
            .createHmac("sha256", ESEWA_SECRET_KEY)
            .update(message)
            .digest("base64");

        return res.status(200).json({
            success: true,
            paymentData: {
                amount: totalAmount,
                tax_amount: "0",
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: productCode,
                product_service_charge: "0",
                product_delivery_charge: "0",
                success_url: `http://localhost:8000/api/payment/esewa/verify`,
                failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: signature,
                payment_url: ESEWA_PAYMENT_URL
            }
        });
    } catch (error) {
        console.error("Initiate eSewa payment error:", error);
        return res.status(500).json({ message: `Initiate payment error: ${error.message}` });
    }
};

export const verifyEsewaPayment = async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) {
            return res.status(400).json({ message: "Payment data not provided" });
        }

        const decodedData = Buffer.from(data, "base64").toString("utf-8");
        const paymentInfo = JSON.parse(decodedData);

        const {
            transaction_code,
            status,
            total_amount,
            transaction_uuid,
            product_code,
            signed_field_names,
            signature
        } = paymentInfo;

        const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;

        const expectedSignature = crypto
            .createHmac("sha256", ESEWA_SECRET_KEY)
            .update(message)
            .digest("base64");

        if (signature !== expectedSignature) {
            console.error("Signature mismatch:", { received: signature, expected: expectedSignature });
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const order = await Order.findOne({ "payment.transactionId": transaction_uuid });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status === "COMPLETE") {
            order.payment.status = "completed";
            order.payment.esewaRefId = transaction_code;
            order.payment.paidAt = new Date();
        } else {
            order.payment.status = "failed";
        }

        order.markModified('payment');
        // Redirect to success page (Order Placed)
        await order.save();

        return res.redirect(`${process.env.FRONTEND_URL}/order-placed?orderId=${order._id}`);

    } catch (error) {
        console.error("Verify eSewa payment error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
};

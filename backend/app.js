import express from 'express'; // import the Express library
import dotenv from 'dotenv'; // import the dotenv library to manage environment variables
dotenv.config(); // load environment variables from .env file
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cors from 'cors'; // let server specify who can access its resources
import shopRouter from './routes/shop.routes.js';
import itemRouter from './routes/item.routes.js';
import orderRouter from './routes/order.routes.js';
import reviewRouter from './routes/review.route.js';
import paymentRouter from './routes/payment.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express(); // initializes the Express application
const allowedOrigins = process.env.WHITE_LISTED_ORIGINS?.split(",") || [];

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (Postman, server-to-server)
        if (!origin) return callback(null, true);

        // allow if origin is in whitelist
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // allow localhost automatically in development
        if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) {
            return callback(null, true);
        }

        // reject everything else
        return callback(new Error(`CORS Error: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json()); // middleware to read req.body as JSON
app.use(cookieParser()); // middleware to parse cookies from incoming requests

// Health Check
app.get('/health',(req, res)=>{
    res.json({
        status:"OK",
        message:"FoodSansar s running"
    })
})

// routes
app.use("/api/auth", authRouter); // use the auth router for routes starting with /api/auth
app.use("/api/user", userRouter); // use the user router for routes starting with /api/user
app.use("/api/shop", shopRouter); // use the shop router for routes starting with /api/shop
app.use("/api/item", itemRouter); // use the item router for routes starting with /api/item
app.use("/api/order", orderRouter); // use the order router for routes starting with /api/order
app.use("/api/review", reviewRouter); // use the review router for routes starting with /api/review
app.use("/api/payment", paymentRouter); // use the payment router for routes starting with /api/payment
app.use("/api/admin", adminRouter); // use the admin router for routes starting with /api/admin

export default app;
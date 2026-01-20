import mongoose from "mongoose"; // import the mongoose library to interact with MongoDB

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
}
 export default connectDB;
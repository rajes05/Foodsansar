import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Compound index to ensure one review per item per order(or user?)
// Let's enforce unique review per item per user is probably too strict if they order again?
// But usually for "food delivery" maybe review per order item is better.
// The plan said "Verify user Ordered the item".
// Let's index standardly for now.
reviewSchema.index({ item: 1, user: 1, order: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;

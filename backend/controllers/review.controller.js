import Review from "../models/review.model.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

// Add a review
export const addReview = async (req, res, next) => {
    try {
        const { itemId, orderId, rating, reviewText } = req.body;
        const userId = req.userId; // Middleware sets req.userId

        // 1. Verify that the user actually ordered this item and status is delivered
        const order = await Order.findOne({
            _id: orderId,
            "shopOrders.shopOrderItems.item": itemId,
            "shopOrders.status": "delivered", // Check if specific shop order is delivered
            // Note: Structure of Order needs to be carefully checked. 
            // Order -> shopOrders (Array) -> shopOrderItems (Array)
            // And we need to make sure the user matches
            user: userId
        });

        // The query above is a bit complex for a single findOne given the nested array structure.
        // It might be safer to fetch the order by ID and user, then manually check.

        const existingOrder = await Order.findOne({ _id: orderId, user: userId });

        if (!existingOrder) {
            return res.status(404).json({ success: false, message: "Order not found or not belonging to user." });
        }

        // Find the specific shopOrder containing the item that is delivered
        let validItemFound = false;
        for (const shopOrder of existingOrder.shopOrders) {
            if (shopOrder.status === 'delivered') {
                const itemExists = shopOrder.shopOrderItems.some(i => i.item.toString() === itemId);
                if (itemExists) {
                    validItemFound = true;
                    break;
                }
            }
        }

        if (!validItemFound) {
            return res.status(400).json({ success: false, message: "You can only review delivered items from your orders." });
        }

        // 2. Check if already reviewed for this specific order & item
        const existingReview = await Review.findOne({
            user: userId,
            item: itemId,
            order: orderId
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this item for this order." });
        }

        // 3. Create Review
        const newReview = await Review.create({
            user: userId,
            item: itemId,
            order: orderId,
            rating,
            reviewText
        });

        // 4. Update Item Average Rating
        const stats = await Review.aggregate([
            { $match: { item: newReview.item } }, // match by item ObjectId
            {
                $group: {
                    _id: '$item',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            await Item.findByIdAndUpdate(itemId, {
                rating: {
                    average: stats[0].avgRating,
                    count: stats[0].nRating
                }
            });
        } else {
            await Item.findByIdAndUpdate(itemId, {
                rating: {
                    average: rating,
                    count: 1
                }
            });
        }

        res.status(201).json({ success: true, message: "Review added successfully!", review: newReview });

    } catch (error) {
        next(error);
    }
};

// Get reviews for an item
export const getItemReviews = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const reviews = await Review.find({ item: itemId })
            .populate('user', 'fullName') // Populate user name
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, reviews });

    } catch (error) {
        next(error);
    }
};

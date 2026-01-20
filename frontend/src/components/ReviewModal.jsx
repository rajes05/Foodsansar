import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { serverUrl } from '../App';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is used or similar

const ReviewModal = ({ isOpen, onClose, itemId, orderId, itemImage, itemName }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/api/review/add`, {
                itemId,
                orderId,
                rating,
                reviewText
            }, { withCredentials: true });

            if (response.data.success) {
                alert("Review added successfully"); // Replace with toast if available
                onClose();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error adding review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                <h2 className="text-xl font-bold mb-4">Rate & Review</h2>
                <div className="flex items-center gap-4 mb-4">
                    <img src={itemImage} alt={itemName} className="w-16 h-16 object-cover rounded" />
                    <p className="font-semibold">{itemName}</p>
                </div>

                <div className="flex space-x-2 mb-4 justify-center">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                    className="hidden"
                                />
                                <FaStar
                                    className="cursor-pointer transition-colors"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={30}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>

                <textarea
                    className="w-full border rounded p-2 mb-4"
                    rows="4"
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-[#ff4d2d] text-white rounded hover:bg-[#e64526] disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

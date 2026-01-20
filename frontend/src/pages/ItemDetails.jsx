import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaStar, FaRegStar, FaRupeeSign, FaMinus, FaPlus, FaShoppingCart, FaLeaf, FaDrumstickBite, FaArrowLeft } from "react-icons/fa";

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

function ItemDetails() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);

    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const fetchItemAndReviews = async () => {
            try {
                const [itemResponse, reviewsResponse] = await Promise.all([
                    axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true }),
                    axios.get(`${serverUrl}/api/review/${itemId}`)
                ]);

                setItem(itemResponse.data);
                setReviews(reviewsResponse.data.reviews || []);
                setLoading(false);
                setReviewsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                setReviewsLoading(false);
            }
        };
        fetchItemAndReviews();
    }, [itemId]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                (i <= rating) ? (
                    <FaStar className='text-yellow-500 text-lg' key={i} />
                ) : (
                    <FaRegStar className='text-yellow-500 text-lg' key={i} />
                )
            )
        }
        return stars;
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) {
        return <div className="h-screen flex justify-center items-center"><ClipLoader size={50} color="#ff4d2d" /></div>;
    }

    if (!item) {
        return <div className="h-screen flex justify-center items-center text-xl text-gray-500">Item not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] px-4 pb-10">
            {/* Back Button */}
            <button
                className='fixed top-[50px] left-4 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm'
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                <span>Back</span>
            </button>

            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mt-10">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[600px] relative bg-gray-100">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div className='absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg'>
                            {item.foodType === "veg" ?
                                <FaLeaf className='text-green-600 text-xl' /> :
                                <FaDrumstickBite className='text-red-600 text-xl' />
                            }
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{item.name}</h1>
                                <span className="text-orange-500 font-medium text-lg bg-orange-50 px-3 py-1 rounded-full inline-block">
                                    {item.category}
                                </span>
                            </div>
                            <div className="flex flex-col items-start sm:items-end">
                                <div className="flex items-center gap-1 mb-1">
                                    {renderStars(item.rating?.average || 0)}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">
                                    {item.rating?.count || 0} Reviews
                                </span>
                            </div>
                        </div>

                        {/* description  */}
                        <div className="mt-8 mb-8 border-t border-b border-gray-100 py-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                {item.description || "No description available for this item."}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                <div className="flex items-center gap-2">
                                    <FaRupeeSign className="text-2xl md:text-3xl text-gray-900" />
                                    <span className="text-3xl md:text-4xl font-bold text-gray-900">{item.price}</span>
                                </div>

                                {/* Quantity Control */}
                                <div className='flex items-center border-2 border-gray-200 rounded-full overflow-hidden shadow-sm bg-gray-50'>
                                    <button className='px-4 py-3 hover:bg-gray-200 transition text-gray-600' onClick={handleDecrease}>
                                        <FaMinus size={14} />
                                    </button>
                                    <span className='px-4 font-bold text-xl text-gray-800 w-12 text-center'>{quantity}</span>
                                    <button className='px-4 py-3 hover:bg-gray-200 transition text-gray-600' onClick={handleIncrease}>
                                        <FaPlus size={14} />
                                    </button>
                                </div>
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 ${cartItems.some(i => i.id === item._id)
                                    ? "bg-gray-800 text-white hover:bg-gray-900"
                                    : "bg-[#ff4d2d] text-white hover:bg-[#e04328] hover:shadow-orange-200"
                                    }`}
                                onClick={() => {
                                    if (quantity > 0) {
                                        dispatch(addToCart({
                                            id: item._id,
                                            name: item.name,
                                            price: item.price,
                                            image: item.image,
                                            shop: item.shop,
                                            quantity,
                                            foodType: item.foodType
                                        }));
                                    }
                                }}
                            >
                                <FaShoppingCart size={22} />
                                {cartItems.some(i => i.id === item._id) ? "In Cart" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="p-6 md:p-12 bg-gray-50 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">User Reviews</h2>

                    {reviewsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ClipLoader size={30} color="#ff4d2d" />
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transitiion hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                                {review.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{review.user?.fullName || 'Anonymous'}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                            <FaStar className="text-yellow-500 mr-1" size={14} />
                                            <span className="font-bold text-gray-800">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">"{review.reviewText}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to order and review!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import {
    FaStar, FaRegStar, FaRupeeSign, FaMinus, FaPlus,
    FaShoppingCart, FaLeaf, FaDrumstickBite, FaArrowLeft,
    FaHeart, FaShareAlt, FaShieldAlt, FaTruck, FaUndo,
    FaCheckCircle, FaFire, FaTag, FaUserShield
} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';
import Footer from '../components/Footer';
import Nav from '../components/Nav';


function ItemDetails() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);

    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wishlisted, setWishlisted] = useState(false);
    const [addedAnim, setAddedAnim] = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [itemRes, reviewsRes] = await Promise.all([
                    axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true }),
                    axios.get(`${serverUrl}/api/review/${itemId}`)
                ]);
                setItem(itemRes.data);
                setReviews(reviewsRes.data.reviews || []);
                setLoading(false);
                setReviewsLoading(false);

                // fetch recommendations by category
                const category = itemRes.data?.category;
                if (category) {
                    try {
                        const recRes = await axios.get(
                            `${serverUrl}/api/item/by-category?category=${encodeURIComponent(category)}&exclude=${itemId}`,
                            { withCredentials: true }
                        );
                        setRecommendations(recRes.data?.items || recRes.data || []);
                    } catch {
                        setRecommendations([]);
                    }
                }
                setRecLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                setReviewsLoading(false);
                setRecLoading(false);
            }
        };
        fetchAll();
        window.scrollTo(0, 0);
    }, [itemId]);

    const renderStars = (rating, size = 'md') => {
        const sz = size === 'sm' ? 'text-xs' : 'text-sm';
        return Array.from({ length: 5 }, (_, i) =>
            i < Math.round(rating)
                ? <FaStar key={i} className={`text-yellow-400 ${sz}`} />
                : <FaRegStar key={i} className={`text-yellow-400 ${sz}`} />
        );
    };

    const handleAddToCart = () => {
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
            setAddedAnim(true);
            setTimeout(() => setAddedAnim(false), 1500);
        }
    };

    const avgRating = item?.rating?.average || 0;
    const reviewCount = item?.rating?.count || 0;
    const isInCart = cartItems.some(i => i.id === item?._id);

    // fake thumbnail array (same image as placeholder)
    const thumbs = item ? [item.image, item.image, item.image] : [];

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{ background: '#f5f5f5' }}>
                <ClipLoader size={50} color="#F85606" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500 text-xl">
                Item not found
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: '#f5f5f5', minHeight: '100vh' }}>

            {/* Nav */}
            <Nav/>

            {/* Google Font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

                .btn-cart {
                    background: #F85606;
                    border: none;
                    color: white;
                    font-weight: 800;
                    font-size: 15px;
                    letter-spacing: 0.5px;
                    padding: 13px 0;
                    border-radius: 2px;
                    width: 100%;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-cart:hover { background: #d44a04; }
                .btn-cart:active { transform: scale(0.98); }

                .btn-buy {
                    background: #FFD000;
                    border: none;
                    color: #222;
                    font-weight: 800;
                    font-size: 15px;
                    letter-spacing: 0.5px;
                    padding: 13px 0;
                    border-radius: 2px;
                    width: 100%;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-buy:hover { background: #e6bb00; }

                .qty-btn {
                    width: 32px; height: 32px;
                    border: 1.5px solid #ddd;
                    background: white;
                    border-radius: 2px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    font-size: 14px;
                    color: #555;
                    transition: border-color 0.2s, color 0.2s;
                }
                .qty-btn:hover { border-color: #F85606; color: #F85606; }

                .tab-btn {
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 700;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: #666;
                    border-bottom: 3px solid transparent;
                    transition: color 0.2s, border-color 0.2s;
                }
                .tab-btn.active {
                    color: #F85606;
                    border-bottom-color: #F85606;
                }
                .tab-btn:hover { color: #F85606; }

                .rec-card {
                    background: white;
                    border-radius: 2px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: box-shadow 0.2s, transform 0.2s;
                    position: relative;
                }
                .rec-card:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.13);
                    transform: translateY(-2px);
                }
                .rec-card:hover .rec-cart-overlay { opacity: 1; }

                .rec-cart-overlay {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    background: #F85606;
                    color: white;
                    text-align: center;
                    padding: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    opacity: 0;
                    transition: opacity 0.2s;
                    cursor: pointer;
                }

                .thumb-img {
                    width: 60px; height: 60px;
                    object-fit: cover;
                    border-radius: 2px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .thumb-img.active { border-color: #F85606; }

                .badge-veg {
                    background: #e8f5e9;
                    color: #2e7d32;
                    font-size: 11px; font-weight: 700;
                    padding: 3px 8px; border-radius: 2px;
                    display: inline-flex; align-items: center; gap: 4px;
                }
                .badge-nonveg {
                    background: #fdecea;
                    color: #c62828;
                    font-size: 11px; font-weight: 700;
                    padding: 3px 8px; border-radius: 2px;
                    display: inline-flex; align-items: center; gap: 4px;
                }

                .rating-bar-fill {
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #F85606, #FFD000);
                    transition: width 0.6s ease;
                }
                .rating-bar-track {
                    height: 8px;
                    border-radius: 4px;
                    background: #e0e0e0;
                    flex: 1;
                }

                @keyframes popIn {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.06); }
                    100% { transform: scale(1); }
                }
                .pop-anim { animation: popIn 0.3s ease; }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .slide-down { animation: slideDown 0.35s ease; }

                .wishlist-btn {
                    width: 40px; height: 40px;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 2px;
                    background: white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.2s, color 0.2s;
                    flex-shrink: 0;
                }
                .wishlist-btn:hover, .wishlist-btn.active {
                    border-color: #F85606;
                    color: #F85606;
                }

                .share-btn {
                    width: 40px; height: 40px;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 2px;
                    background: white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.2s, color 0.2s;
                    flex-shrink: 0;
                }
                .share-btn:hover { border-color: #F85606; color: #F85606; }

                .breadcrumb a { color: #F85606; font-size: 12px; text-decoration: none; }
                .breadcrumb span { color: #aaa; font-size: 12px; margin: 0 5px; }
            `}</style>

            {/* Top spacing for navbar */}
            <div style={{ paddingTop: '80px' }} />

            {/* Breadcrumb */}
            <div className="breadcrumb" style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="/">Home</a>
                <span>›</span>
                <a href="/shops">Food</a>
                <span>›</span>
                <a href="#" onClick={() => navigate(-1)}>{item.category}</a>
                <span>›</span>
                <span style={{ color: '#222', fontSize: 12 }}>{item.name}</span>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 24px' }}>

                {/* Product Card Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.1fr 0.8fr',
                    gap: 2,
                    background: 'white',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }} className="slide-down">

                    {/* === COL 1: Image Gallery === */}
                    <div style={{ padding: '24px 16px', borderRight: '1px solid #f0f0f0' }}>
                        {/* Main Image */}
                        <div style={{
                            width: '100%', aspectRatio: '1/1', background: '#f9f9f9',
                            borderRadius: 4, overflow: 'hidden', position: 'relative', marginBottom: 12
                        }}>
                            <img
                                src={thumbs[selectedImg]}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            {/* Food type badge */}
                            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                                {item.foodType === 'veg'
                                    ? <span className="badge-veg"><FaLeaf size={10} /> VEG</span>
                                    : <span className="badge-nonveg"><FaDrumstickBite size={10} /> NON-VEG</span>
                                }
                            </div>
                            {/* Hot badge */}
                            <div style={{ position: 'absolute', top: 10, right: 10, background: '#F85606', color: 'white', fontSize: 11, fontWeight: 800, padding: '3px 7px', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FaFire size={10} /> HOT
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            {thumbs.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className={`thumb-img${selectedImg === i ? ' active' : ''}`}
                                    onClick={() => setSelectedImg(i)}
                                />
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                                className={`wishlist-btn${wishlisted ? ' active' : ''}`}
                                onClick={() => setWishlisted(w => !w)}
                                title="Add to Wishlist"
                            >
                                <FaHeart size={16} color={wishlisted ? '#F85606' : '#999'} />
                            </button>
                            <button className="share-btn" title="Share">
                                <FaShareAlt size={16} color="#999" />
                            </button>
                            <div style={{ flex: 1, background: '#fff8f4', border: '1.5px solid #ffe0d0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#F85606', fontWeight: 700, padding: '0 12px' }}>
                                <FaTag size={11} /> <span>Best Price</span>
                            </div>
                        </div>
                    </div>

                    {/* === COL 2: Product Info === */}
                    <div style={{ padding: '24px 20px', borderRight: '1px solid #f0f0f0' }}>
                        {/* Title */}
                        <h1 style={{ fontSize: 17, fontWeight: 800, color: '#222', lineHeight: 1.5, marginBottom: 10 }}>
                            {item.name}
                        </h1>

                        {/* Rating row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: '#F85606' }}>{avgRating.toFixed(1)}</span>
                            <div style={{ display: 'flex', gap: 2 }}>{renderStars(avgRating)}</div>
                            <span style={{ color: '#999', fontSize: 13 }}>|</span>
                            <span style={{ color: '#999', fontSize: 13 }}>{reviewCount} Ratings</span>
                            <span style={{ color: '#999', fontSize: 13 }}>|</span>
                            <span style={{ color: '#07b700', fontSize: 13, fontWeight: 700 }}>
                                <FaCheckCircle style={{ display: 'inline', marginRight: 3 }} size={11} />
                                In Stock
                            </span>
                        </div>

                        {/* Category badge */}
                        <div style={{ marginBottom: 16 }}>
                            <span style={{ background: '#fff3ec', color: '#F85606', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 2 }}>
                                {item.category}
                            </span>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, background: '#fff8f4', padding: '14px 16px', borderRadius: 4, borderLeft: '4px solid #F85606' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FaRupeeSign style={{ color: '#F85606', fontSize: 22 }} />
                                <span style={{ fontSize: 30, fontWeight: 900, color: '#F85606' }}>{item.price}</span>
                            </div>
                            <span style={{ fontSize: 15, color: '#bbb', textDecoration: 'line-through' }}>
                                Rs. {Math.round(item.price * 1.2)}
                            </span>
                            <span style={{ background: '#F85606', color: 'white', fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 2 }}>
                                -17%
                            </span>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 18px' }} />

                        {/* Details list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                            {[
                                { label: 'Food Type', value: item.foodType === 'veg' ? '🌿 Vegetarian' : '🍗 Non-Vegetarian' },
                                { label: 'Category', value: item.category },
                                { label: 'Shop', value: item.shop?.name || 'FoodSansar' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', gap: 0 }}>
                                    <span style={{ width: 110, color: '#999', fontSize: 13, flexShrink: 0 }}>{label}</span>
                                    <span style={{ color: '#555', fontSize: 13, marginRight: 8 }}>:</span>
                                    <span style={{ color: '#222', fontSize: 13, fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 18px' }} />

                        {/* Description preview */}
                        <div>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#222', marginBottom: 8 }}>About this item</h3>
                            <p style={{ color: '#666', fontSize: 13, lineHeight: 1.7 }}>
                                {item.description || "Fresh and delicious, made with quality ingredients. Perfect for any meal time."}
                            </p>
                        </div>
                    </div>

                    {/* === COL 3: Cart Box === */}
                    <div style={{ padding: '24px 18px', background: '#fafafa' }}>
                        {/* Delivery info */}
                        <div style={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: 4, padding: '14px', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                                <FaTruck style={{ color: '#F85606', marginTop: 2, flexShrink: 0 }} size={14} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>Free Delivery</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>Delivered within 30-45 mins</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                                <FaShieldAlt style={{ color: '#F85606', marginTop: 2, flexShrink: 0 }} size={14} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>Quality Guarantee</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>Fresh & hygienic food</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <FaUserShield
                                    style={{ color: '#F85606', marginTop: 2, flexShrink: 0 }}
                                    size={14}
                                />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>
                                        Trusted by Customers
                                    </div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        Rated & reviewed by real users
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Quantity</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                    <FaMinus size={11} />
                                </button>
                                <span style={{ fontSize: 17, fontWeight: 800, minWidth: 28, textAlign: 'center', color: '#222' }}>{quantity}</span>
                                <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>
                                    <FaPlus size={11} />
                                </button>
                                <span style={{ fontSize: 13, color: '#999', marginLeft: 4 }}>
                                    Total: <strong style={{ color: '#F85606' }}>Rs. {item.price * quantity}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Cart Button */}
                        <button
                            className={`btn-cart${addedAnim ? ' pop-anim' : ''}`}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart size={16} />
                            {isInCart ? '✓ In Cart' : 'Add to Cart'}
                        </button>

                        <div style={{ height: 10 }} />

                        {/* Buy Now Button */}
                        <button className="btn-buy" onClick={handleAddToCart}>
                            Buy Now
                        </button>

                        {/* Sold by */}
                        <div style={{ marginTop: 16, padding: '12px', background: 'white', border: '1px solid #f0f0f0', borderRadius: 4 }}>
                            <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Sold by</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#F85606', cursor: 'pointer' }}>
                                {item.shop?.name || 'FoodSansar'}
                            </div>
                            <div style={{ fontSize: 11, color: '#07b700', fontWeight: 700, marginTop: 4 }}>
                                <FaCheckCircle style={{ display: 'inline', marginRight: 3 }} size={10} />
                                Verified Seller
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div style={{ background: 'white', borderRadius: 2, marginTop: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    {/* Tab Buttons */}
                    <div style={{ borderBottom: '1px solid #f0f0f0', display: 'flex', paddingLeft: 16 }}>
                        {[
                            { key: 'description', label: 'Description' },
                            { key: 'reviews', label: `Reviews (${reviewCount})` },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: '24px' }} className="slide-down" key={activeTab}>

                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div>
                                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.9 }}>
                                    {item.description || "This delicious item is prepared with the finest ingredients ensuring great taste and quality. Perfect for any occasion. Our chefs prepare this dish fresh to ensure maximum taste and nutrition."}
                                </p>
                                {/* Feature highlights */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
                                    {[
                                        { icon: '🌿', title: 'Fresh Ingredients', desc: 'Sourced daily for quality' },
                                        { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Prepared by professionals' },
                                        { icon: '⚡', title: 'Quick Delivery', desc: 'Hot & fresh to your door' },
                                        { icon: '✅', title: 'Hygienic', desc: 'Safety standards followed' },
                                    ].map(f => (
                                        <div key={f.title} style={{ background: '#f9f9f9', borderRadius: 4, padding: '14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: 22 }}>{f.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 800, color: '#222' }}>{f.title}</div>
                                                <div style={{ fontSize: 12, color: '#999' }}>{f.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                {/* Rating Summary */}
                                <div style={{ display: 'flex', gap: 40, marginBottom: 28, flexWrap: 'wrap' }}>
                                    {/* Overall Score */}
                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                        <div style={{ fontSize: 52, fontWeight: 900, color: '#222', lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '6px 0 4px' }}>
                                            {renderStars(avgRating)}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#999' }}>{reviewCount} Reviews</div>
                                    </div>

                                    {/* Bar chart */}
                                    <div style={{ flex: 1, minWidth: 180 }}>
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                            const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                                            return (
                                                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                    <span style={{ fontSize: 12, color: '#555', width: 8 }}>{star}</span>
                                                    <FaStar size={11} color="#FFD000" />
                                                    <div className="rating-bar-track">
                                                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, color: '#999', width: 24 }}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: 20 }} />

                                {/* Review Cards */}
                                {reviewsLoading ? (
                                    <div style={{ textAlign: 'center', padding: 30 }}>
                                        <ClipLoader size={28} color="#F85606" />
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                                        {reviews.map((review) => (
                                            <div key={review._id} style={{
                                                background: '#fafafa', borderRadius: 4, padding: '16px',
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: '50%',
                                                            background: '#F85606', color: 'white',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 900, fontSize: 15, flexShrink: 0
                                                        }}>
                                                            {review.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>
                                                                {review.user?.fullName || 'Anonymous'}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: '#bbb' }}>
                                                                {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ background: '#F85606', color: 'white', borderRadius: 3, padding: '3px 8px', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                        <FaStar size={10} /> {review.rating}
                                                    </div>
                                                </div>
                                                <p style={{ color: '#555', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                                                    "{review.reviewText}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #f0f0f0', borderRadius: 4 }}>
                                        <div style={{ fontSize: 32, marginBottom: 10 }}>⭐</div>
                                        <p style={{ color: '#bbb', fontSize: 14 }}>No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ============ RECOMMENDATIONS SECTION ============ */}
                <div style={{ marginTop: 8, background: 'white', borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    {/* Section Header */}
                    <div style={{ padding: '16px 20px', borderBottom: '2px solid #F85606', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaFire color="#F85606" size={16} />
                            <span style={{ fontSize: 16, fontWeight: 900, color: '#222' }}>
                                People Also Like
                            </span>
                            <span style={{ background: '#fff3ec', color: '#F85606', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 2 }}>
                                {item.category}
                            </span>
                        </div>
                        <button
                            style={{ fontSize: 13, color: '#F85606', fontWeight: 700, background: 'none', border: '1px solid #F85606', borderRadius: 2, padding: '4px 12px', cursor: 'pointer' }}
                            onClick={() => navigate('/shops')}
                        >
                            See All
                        </button>
                    </div>

                    {/* Recommendation Cards */}
                    <div style={{ padding: '16px 20px' }}>
                        {recLoading ? (
                            <div style={{ textAlign: 'center', padding: 30 }}>
                                <ClipLoader size={28} color="#F85606" />
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                gap: 10
                            }}>
                                {recommendations.slice(0, 6).map((rec) => (
                                    <div
                                        key={rec._id}
                                        className="rec-card"
                                        onClick={() => navigate(`/item/${rec._id}`)}
                                    >
                                        {/* Image */}
                                        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
                                            <img
                                                src={rec.image}
                                                alt={rec.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                            {/* Food type tag */}
                                            <div style={{ position: 'absolute', top: 6, left: 6 }}>
                                                {rec.foodType === 'veg'
                                                    ? <span className="badge-veg"><FaLeaf size={8} /></span>
                                                    : <span className="badge-nonveg"><FaDrumstickBite size={8} /></span>
                                                }
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div style={{ padding: '10px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 4, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                {rec.name}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                                                <FaStar color="#FFD000" size={11} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#222' }}>{rec.rating?.average?.toFixed(1) || '0.0'}</span>
                                                <span style={{ fontSize: 11, color: '#bbb' }}>({rec.rating?.count || 0})</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <FaRupeeSign size={11} color="#F85606" />
                                                <span style={{ fontSize: 15, fontWeight: 900, color: '#F85606' }}>{rec.price}</span>
                                            </div>
                                        </div>
                                        {/* Hover overlay */}
                                        <div
                                            className="rec-cart-overlay"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(addToCart({
                                                    id: rec._id,
                                                    name: rec.name,
                                                    price: rec.price,
                                                    image: rec.image,
                                                    shop: rec.shop,
                                                    quantity: 1,
                                                    foodType: rec.foodType
                                                }));
                                            }}
                                        >
                                            <FaShoppingCart size={12} style={{ display: 'inline', marginRight: 5 }} />
                                            Add to Cart
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Skeleton fallback if no recommendations yet */
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} style={{ background: '#f5f5f5', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ aspectRatio: '1/1', background: '#e0e0e0' }} />
                                        <div style={{ padding: 10 }}>
                                            <div style={{ height: 12, background: '#e0e0e0', borderRadius: 2, marginBottom: 6 }} />
                                            <div style={{ height: 12, background: '#ebebeb', borderRadius: 2, width: '60%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Back button bottom */}
                <div style={{ marginTop: 16, display: 'flex' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'white', border: '1px solid #e0e0e0',
                            color: '#555', fontWeight: 700, fontSize: 13,
                            padding: '10px 18px', borderRadius: 2, cursor: 'pointer'
                        }}
                    >
                        <FaArrowLeft size={12} /> Back to Listings
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ItemDetails;
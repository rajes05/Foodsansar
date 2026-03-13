import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import {
    FaStar,
    FaRegStar,
    FaRupeeSign,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaLeaf,
    FaDrumstickBite,
    FaArrowLeft,
    FaHeart,
    FaShareAlt,
    FaShieldAlt,
    FaTruck,
    FaUndo,
    FaCheckCircle,
    FaFire,
    FaTag,
    FaUserShield,
    FaBolt,
    FaUtensils,
    FaIceCream,
    FaCoffee,
    FaBreadSlice,
    FaAppleAlt,
    FaHamburger,
    FaPizzaSlice,
    FaDrumstickBite as FaMeat,
    FaFish,
    FaCarrot,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import RollBackButton from "../components/ui/RollBackButton";

const CATEGORY_ICONS = {
    "Burgers": FaHamburger,
    "Pizza": FaPizzaSlice,
    "Coffee": FaCoffee,
    "Desserts": FaIceCream,
    "Beverages": FaCoffee,
    "Bakery": FaBreadSlice,
    "Healthy": FaAppleAlt,
    "Seafood": FaFish,
    "Vegan": FaCarrot,
    "Meat": FaMeat,
};

const getCategoryIcon = (category) => {
    if (!category) return FaUtensils;
    const match = Object.keys(CATEGORY_ICONS).find(k =>
        category.toLowerCase().includes(k.toLowerCase())
    );
    return match ? CATEGORY_ICONS[match] : FaUtensils;
};

const BADGE_CONFIG = {
    "Popular":           { color: "#e67e00", bg: "#fff4e5", border: "#f5c47a" },
    "Similar":           { color: "#1a7abf", bg: "#e8f2fb", border: "#7ab8e8" },
    "Users Also Liked":  { color: "#2e7d32", bg: "#e8f5e9", border: "#81c784" },
    "Frequently Together":{ color: "#7b1fa2", bg: "#f3e5f5", border: "#ce93d8" },
};

function ItemDetails() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.user);

    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [wishlisted, setWishlisted] = useState(false);
    const [addedAnim, setAddedAnim] = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);
    const [showAllRecs, setShowAllRecs] = useState(false);
    const RECS_PER_ROW = 4;

    const aprioriScore = (rec, currentItem) => {
        let score = 0;
        if (rec.category === currentItem?.category) score += 2;
        if (rec.foodType === currentItem?.foodType) score += 1;
        return score;
    };

    const contentScore = (rec, currentItem) => {
        let score = 0;
        if (rec.category === currentItem?.category) score += 3;
        if (rec.foodType === currentItem?.foodType) score += 2;
        const priceDiff = Math.abs(rec.price - (currentItem?.price || 0));
        score += Math.max(0, 2 - priceDiff / 100);
        return score;
    };

    const popularityScore = (rec) => {
        const avg = rec.rating?.average || 0;
        const cnt = rec.rating?.count || 0;
        return avg * Math.log1p(cnt);
    };

    const collaborativeScore = (rec, currentItem) => {
        const currentAvg = currentItem?.rating?.average || 0;
        const recAvg = rec.rating?.average || 0;
        const ratingProximity = 5 - Math.abs(currentAvg - recAvg);
        const categoryMatch = rec.category === currentItem?.category ? 3 : 0;
        return ratingProximity + categoryMatch;
    };

    const combineAndRankRecs = (items, currentItem) => {
        return items
            .map((rec) => {
                const pop = popularityScore(rec);
                const cont = contentScore(rec, currentItem);
                const collab = collaborativeScore(rec, currentItem);
                const apr = aprioriScore(rec, currentItem);
                const total = pop + cont + collab + apr;
                const maxScore = Math.max(pop, cont, collab, apr);
                let badge = "Popular";
                if (maxScore === cont) badge = "Similar";
                else if (maxScore === collab) badge = "Users Also Liked";
                else if (maxScore === apr) badge = "Frequently Together";
                return { ...rec, _recScore: total, _recBadge: badge };
            })
            .sort((a, b) => b._recScore - a._recScore);
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [itemRes, reviewsRes] = await Promise.all([
                    axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true }),
                    axios.get(`${serverUrl}/api/review/${itemId}`),
                ]);
                setItem(itemRes.data);
                setReviews(reviewsRes.data.reviews || []);
                setLoading(false);
                setReviewsLoading(false);

                const category = itemRes.data?.category;
                if (category) {
                    try {
                        const recRes = await axios.get(
                            `${serverUrl}/api/item/by-category?category=${encodeURIComponent(category)}&exclude=${itemId}`,
                            { withCredentials: true },
                        );
                        const rawItems = (recRes.data?.items || recRes.data || []).filter((i) => i._id !== itemId);
                        const ranked = combineAndRankRecs(rawItems, itemRes.data);
                        setRecommendations(ranked);
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

    const renderStars = (rating, size = "md") => {
        const sz = size === "sm" ? "text-xs" : "text-sm";
        return Array.from({ length: 5 }, (_, i) =>
            i < Math.round(rating) ? (
                <FaStar key={i} className={`text-yellow-400 ${sz}`} />
            ) : (
                <FaRegStar key={i} className={`text-yellow-400 ${sz}`} />
            ),
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
                foodType: item.foodType,
            }));
            setAddedAnim(true);
            setTimeout(() => setAddedAnim(false), 1500);
        }
    };

    const avgRating = item?.rating?.average || 0;
    const reviewCount = item?.rating?.count || 0;
    const isInCart = cartItems.some((i) => i.id === item?._id);
    const thumbs = item ? [item.image, item.image, item.image] : [];

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{ background: "#f7f6f3" }}>
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

    const CategoryIcon = getCategoryIcon(item.category);

    return (
        <div style={{ fontFamily: "'DM Sans', 'Nunito Sans', sans-serif", background: "#f7f6f3", minHeight: "100vh" }}>
            <Nav />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

                * { box-sizing: border-box; }

                /* ---- ITEM CARD GRID ---- */
                .item-card-grid {
                    display: grid;
                    grid-template-columns: 340px 1fr 300px;
                    gap: 0;
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 20px rgba(0,0,0,0.07);
                    margin-top: 56px;
                }

                @media (max-width: 1100px) {
                    .item-card-grid {
                        grid-template-columns: 300px 1fr;
                    }
                    .cart-col { display: none !important; }
                    .mobile-cart-bar { display: flex !important; }
                }

                @media (max-width: 768px) {
                    .item-card-grid {
                        grid-template-columns: 1fr;
                        border-radius: 12px;
                        margin-top: 16px;
                    }
                    .img-col { border-right: none !important; border-bottom: 1px solid #f0ede8; }
                    .info-col { border-right: none !important; }
                    .tabs-section { border-radius: 12px; }
                    .recs-section { border-radius: 12px; }
                    .recs-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .page-wrap { padding: 0 12px 24px !important; padding-top: 90px !important; }
                }

                @media (max-width: 480px) {
                    .recs-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .review-grid { grid-template-columns: 1fr !important; }
                    .feature-grid { grid-template-columns: 1fr 1fr !important; }
                }

                /* ---- MOBILE CART BAR ---- */
                .mobile-cart-bar {
                    display: none;
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    background: white;
                    padding: 12px 16px;
                    gap: 10px;
                    border-top: 1px solid #f0ede8;
                    box-shadow: 0 -4px 24px rgba(0,0,0,0.09);
                    z-index: 100;
                    align-items: center;
                }

                /* ---- BUTTONS ---- */
                .btn-primary {
                    background: #F85606;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 14px;
                    padding: 12px 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background 0.18s, transform 0.1s;
                    white-space: nowrap;
                }
                .btn-primary:hover { background: #d94f04; }
                .btn-primary:active { transform: scale(0.97); }

                .btn-secondary {
                    background: #fff5f0;
                    color: #F85606;
                    border: 1.5px solid #fdd3bd;
                    border-radius: 10px;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 14px;
                    padding: 12px 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background 0.18s;
                    white-space: nowrap;
                }
                .btn-secondary:hover { background: #ffe8da; }

                /* ---- QUANTITY CONTROL ---- */
                .qty-control {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    border: 1.5px solid #ecddd5;
                    border-radius: 10px;
                    overflow: hidden;
                    background: white;
                }
                .qty-btn {
                    width: 36px; height: 36px;
                    background: #fff8f5;
                    border: none;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px;
                    color: #F85606;
                    transition: background 0.15s;
                    font-family: inherit;
                }
                .qty-btn:hover { background: #ffe0ce; }
                .qty-display {
                    min-width: 36px;
                    text-align: center;
                    font-size: 15px;
                    font-weight: 600;
                    color: #1a1a1a;
                    border-left: 1.5px solid #ecddd5;
                    border-right: 1.5px solid #ecddd5;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ---- TABS ---- */
                .tab-btn {
                    padding: 14px 24px;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: inherit;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: #888;
                    border-bottom: 2.5px solid transparent;
                    transition: color 0.18s, border-color 0.18s;
                }
                .tab-btn.active { color: #F85606; border-bottom-color: #F85606; }
                .tab-btn:hover { color: #F85606; }

                /* ---- REC CARD ---- */
                .rec-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: box-shadow 0.2s, transform 0.18s;
                    border: 1px solid #f0ede8;
                    position: relative;
                }
                .rec-card:hover {
                    box-shadow: 0 6px 24px rgba(248,86,6,0.13);
                    transform: translateY(-3px);
                }
                .rec-cart-btn {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    background: #F85606;
                    color: white;
                    text-align: center;
                    padding: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 0;
                    transition: opacity 0.2s;
                    cursor: pointer;
                    font-family: inherit;
                    border: none;
                }
                .rec-card:hover .rec-cart-btn { opacity: 1; }

                /* ---- FOOD TYPE BADGES ---- */
                .badge-veg {
                    background: #edf7ed;
                    color: #2a7d2e;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 8px;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    letter-spacing: 0.3px;
                }
                .badge-nonveg {
                    background: #fdecea;
                    color: #c53030;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 8px;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    letter-spacing: 0.3px;
                }

                /* ---- THUMB ---- */
                .thumb-img {
                    width: 58px; height: 58px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: border-color 0.18s, opacity 0.18s;
                    opacity: 0.7;
                }
                .thumb-img.active { border-color: #F85606; opacity: 1; }
                .thumb-img:hover { opacity: 1; }

                /* ---- RATING BARS ---- */
                .rating-bar-track {
                    height: 6px;
                    border-radius: 99px;
                    background: #f0ede8;
                    flex: 1;
                    overflow: hidden;
                }
                .rating-bar-fill {
                    height: 100%;
                    border-radius: 99px;
                    background: linear-gradient(90deg, #F85606, #ffb347);
                    transition: width 0.5s ease;
                }

                /* ---- ANIMATIONS ---- */
                @keyframes popIn {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.04); }
                    100% { transform: scale(1); }
                }
                .pop-anim { animation: popIn 0.28s ease; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.35s ease; }

                /* ---- ICON BUTTON ---- */
                .icon-btn {
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    border: 1.5px solid #ecddd5;
                    background: white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.18s, background 0.18s;
                    flex-shrink: 0;
                }
                .icon-btn:hover { border-color: #F85606; background: #fff5f0; }
                .icon-btn.active { border-color: #F85606; background: #fff5f0; }

                /* ---- TRUST ROW ---- */
                .trust-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 12px 0;
                    border-bottom: 1px solid #f7f4f1;
                }
                .trust-item:last-child { border-bottom: none; }

                /* ---- REVIEW CARD ---- */
                .review-card {
                    background: #faf9f7;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px solid #f0ede8;
                }

                /* ---- SECTION HEADER ---- */
                .section-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
                    overflow: hidden;
                    margin-top: 24px;
                }

                /* ---- SKELETON ---- */
                .skeleton {
                    background: linear-gradient(90deg, #f0ede8 25%, #faf8f5 50%, #f0ede8 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                    border-radius: 8px;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div style={{ paddingTop: "100px" }} />
            <div style={{ position: 'absolute', top: '100px', left: '16px', zIndex: 10 }}>
                <RollBackButton to={-1} fixed={false} />
            </div>

            <div className="page-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 100px" }}>

                {/* ======= ITEM CARD SECTION ======= */}
                <div className="item-card-grid fade-up">

                    {/* COL 1 — Image Gallery */}
                    <div className="img-col" style={{ padding: "28px 20px", borderRight: "1px solid #f7f4f1" }}>
                        {/* Main image */}
                        <div style={{
                            width: "100%", aspectRatio: "1/1",
                            borderRadius: 14, overflow: "hidden",
                            position: "relative", background: "#f9f7f4", marginBottom: 14,
                        }}>
                            <img
                                src={thumbs[selectedImg]}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.2s" }}
                            />
                            {/* Food type */}
                            <div style={{ position: "absolute", top: 12, left: 12 }}>
                                {item.foodType === "veg"
                                    ? <span className="badge-veg"><FaLeaf size={9} /> Veg</span>
                                    : <span className="badge-nonveg"><FaDrumstickBite size={9} /> Non-Veg</span>}
                            </div>
                            {/* HOT pill */}
                            <div style={{
                                position: "absolute", top: 12, right: 12,
                                background: "#F85606", color: "white",
                                fontSize: 10, fontWeight: 700, padding: "4px 9px",
                                borderRadius: 8, display: "flex", alignItems: "center", gap: 4,
                                letterSpacing: 0.5,
                            }}>
                                <FaFire size={9} /> HOT
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                            {thumbs.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className={`thumb-img${selectedImg === i ? " active" : ""}`}
                                    onClick={() => setSelectedImg(i)}
                                />
                            ))}
                        </div>

                        {/* Action row */}
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                className={`icon-btn${wishlisted ? " active" : ""}`}
                                onClick={() => setWishlisted(w => !w)}
                                title="Add to Wishlist"
                            >
                                <FaHeart size={15} color={wishlisted ? "#F85606" : "#bbb"} />
                            </button>
                            <button className="icon-btn" title="Share">
                                <FaShareAlt size={15} color="#bbb" />
                            </button>
                            <div style={{
                                flex: 1, background: "#fff8f4", border: "1.5px solid #fdd3bd",
                                borderRadius: 10, display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 6, fontSize: 12,
                                color: "#F85606", fontWeight: 600, padding: "0 12px", height: 38,
                            }}>
                                <FaTag size={11} /> Best Price Guaranteed
                            </div>
                        </div>
                    </div>

                    {/* COL 2 — Product Info */}
                    <div className="info-col" style={{ padding: "28px 24px", borderRight: "1px solid #f7f4f1" }}>

                        {/* Category pill */}
                        <div style={{ marginBottom: 12 }}>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: "#fff5f0", color: "#F85606",
                                fontSize: 12, fontWeight: 600,
                                padding: "5px 12px", borderRadius: 8,
                                border: "1px solid #fdd3bd",
                            }}>
                                <CategoryIcon size={11} />
                                {item.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 22, fontWeight: 700,
                            color: "#1a1a1a", lineHeight: 1.4, marginBottom: 12,
                        }}>
                            {item.name}
                        </h1>

                        {/* Rating row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 5,
                                background: "#fffbf0", border: "1px solid #fce8a0",
                                borderRadius: 8, padding: "4px 10px",
                            }}>
                                <FaStar size={12} color="#f5a623" />
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#a16207" }}>
                                    {avgRating.toFixed(1)}
                                </span>
                            </div>
                            <span style={{ color: "#c0b8b0", fontSize: 13 }}>{reviewCount} ratings</span>
                            <span style={{ color: "#c0b8b0" }}>·</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2a7d2e", fontWeight: 600 }}>
                                <FaCheckCircle size={11} /> In Stock
                            </span>
                        </div>

                        {/* Price block */}
                        <div style={{
                            background: "#faf9f7", border: "1px solid #f0ede8",
                            borderRadius: 12, padding: "16px 18px", marginBottom: 22,
                            display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                        }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                                <span style={{ fontSize: 14, color: "#F85606", fontWeight: 600, marginBottom: 2 }}>Rs.</span>
                                <span style={{ fontSize: 32, fontWeight: 700, color: "#F85606", lineHeight: 1 }}>
                                    {item.price}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 13, color: "#c0b8b0", textDecoration: "line-through" }}>
                                    Rs. {Math.round(item.price * 1.2)}
                                </span>
                                <span style={{
                                    fontSize: 11, fontWeight: 700, color: "#2a7d2e",
                                    background: "#edf7ed", borderRadius: 6, padding: "2px 7px",
                                }}>
                                    Save 17%
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
                            {[
                                { label: "Type", value: item.foodType === "veg" ? "🌿 Vegetarian" : "🍗 Non-Vegetarian" },
                                { label: "Category", value: item.category },
                                { label: "Sold by", value: item.shop?.name || "FoodSansar" },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 72, fontSize: 13, color: "#a89e96", fontWeight: 500, flexShrink: 0 }}>
                                        {label}
                                    </span>
                                    <span style={{ fontSize: 13, color: "#888", marginRight: 6 }}>—</span>
                                    <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ height: 1, background: "#f0ede8", marginBottom: 20 }} />

                        {/* Description */}
                        <div>
                            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#a89e96", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>
                                About this item
                            </h3>
                            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                                {item.description || "Fresh and delicious, made with quality ingredients. Perfect for any meal time."}
                            </p>
                        </div>
                    </div>

                    {/* COL 3 — Cart box (desktop only) */}
                    <div className="cart-col" style={{ padding: "28px 20px", background: "#faf9f7" }}>

                        {/* Trust signals */}
                        <div style={{
                            background: "white", border: "1px solid #f0ede8",
                            borderRadius: 12, padding: "4px 16px", marginBottom: 18,
                        }}>
                            {[
                                { icon: FaTruck, title: "Free Delivery", sub: "30–45 mins" },
                                { icon: FaShieldAlt, title: "Quality Guarantee", sub: "Fresh & hygienic" },
                                { icon: FaUserShield, title: "Trusted by Customers", sub: "Verified reviews" },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="trust-item">
                                    <div style={{
                                        width: 32, height: 32, background: "#fff5f0",
                                        borderRadius: 8, display: "flex", alignItems: "center",
                                        justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <Icon size={13} color="#F85606" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{title}</div>
                                        <div style={{ fontSize: 12, color: "#a89e96" }}>{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>Quantity</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className="qty-control">
                                    <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                        <FaMinus size={10} />
                                    </button>
                                    <span className="qty-display">{quantity}</span>
                                    <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>
                                        <FaPlus size={10} />
                                    </button>
                                </div>
                                <span style={{ fontSize: 13, color: "#a89e96" }}>
                                    Total: <strong style={{ color: "#F85606" }}>Rs. {item.price * quantity}</strong>
                                </span>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <button
                            className={`btn-primary${addedAnim ? " pop-anim" : ""}`}
                            style={{ width: "100%", marginBottom: 10 }}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart size={15} />
                            {isInCart ? "✓ Added to Cart" : "Add to Cart"}
                        </button>
                        <button className="btn-secondary" style={{ width: "100%" }} onClick={handleAddToCart}>
                            <FaBolt size={13} /> Buy Now
                        </button>

                        {/* Sold by */}
                        <div style={{
                            marginTop: 16, padding: "12px 14px",
                            background: "white", border: "1px solid #f0ede8",
                            borderRadius: 10,
                        }}>
                            <div style={{ fontSize: 11, color: "#a89e96", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Sold by
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#F85606", cursor: "pointer" }}>
                                {item.shop?.name || "FoodSansar"}
                            </div>
                            <div style={{ fontSize: 11, color: "#2a7d2e", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <FaCheckCircle size={10} /> Verified Seller
                            </div>
                        </div>
                    </div>
                </div>
                {/* ======= END ITEM CARD ======= */}

                {/* Mobile Bottom Cart Bar */}
                <div className="mobile-cart-bar">
                    <div className="qty-control">
                        <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}><FaMinus size={10} /></button>
                        <span className="qty-display">{quantity}</span>
                        <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}><FaPlus size={10} /></button>
                    </div>
                    <button
                        className={`btn-primary${addedAnim ? " pop-anim" : ""}`}
                        style={{ flex: 1 }}
                        onClick={handleAddToCart}
                    >
                        <FaShoppingCart size={14} />
                        {isInCart ? "✓ In Cart" : "Add to Cart"} — Rs. {item.price * quantity}
                    </button>
                </div>

                {/* ======= TABS SECTION ======= */}
                <div className="section-card tabs-section">
                    <div style={{ borderBottom: "1px solid #f0ede8", display: "flex", paddingLeft: 20 }}>
                        {[
                            { key: "description", label: "Description" },
                            { key: "reviews", label: `Reviews (${reviewCount})` },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: "28px 24px" }} className="fade-up" key={activeTab}>
                        {activeTab === "description" && (
                            <div>
                                <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 24 }}>
                                    {item.description || "This delicious item is prepared with the finest ingredients ensuring great taste and quality. Perfect for any occasion."}
                                </p>
                                <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
                                    {[
                                        { icon: "🌿", title: "Fresh Ingredients", desc: "Sourced daily" },
                                        { icon: "👨‍🍳", title: "Expert Chefs", desc: "Prepared professionally" },
                                        { icon: "⚡", title: "Quick Delivery", desc: "Hot to your door" },
                                        { icon: "✅", title: "Hygienic", desc: "Safety standards followed" },
                                    ].map(f => (
                                        <div key={f.title} style={{
                                            background: "#faf9f7", borderRadius: 12,
                                            padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                                            border: "1px solid #f0ede8",
                                        }}>
                                            <span style={{ fontSize: 20 }}>{f.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{f.title}</div>
                                                <div style={{ fontSize: 12, color: "#a89e96" }}>{f.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div>
                                <div style={{ display: "flex", gap: 40, marginBottom: 28, flexWrap: "wrap" }}>
                                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                                        <div style={{ fontSize: 52, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                                            {avgRating.toFixed(1)}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "6px 0 4px" }}>
                                            {renderStars(avgRating)}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#a89e96" }}>{reviewCount} Reviews</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 180 }}>
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                            const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                                            return (
                                                <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 12, color: "#a89e96", width: 8 }}>{star}</span>
                                                    <FaStar size={10} color="#f5a623" />
                                                    <div className="rating-bar-track">
                                                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, color: "#a89e96", width: 20 }}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{ height: 1, background: "#f0ede8", marginBottom: 20 }} />

                                {reviewsLoading ? (
                                    <div style={{ textAlign: "center", padding: 30 }}><ClipLoader size={28} color="#F85606" /></div>
                                ) : reviews.length > 0 ? (
                                    <div className="review-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                                        {reviews.map(review => (
                                            <div key={review._id} className="review-card">
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: "50%",
                                                            background: "#F85606", color: "white",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontWeight: 700, fontSize: 14, flexShrink: 0,
                                                        }}>
                                                            {review.user?.fullName?.charAt(0).toUpperCase() || "U"}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                                                                {review.user?.fullName || "Anonymous"}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: "#c0b8b0" }}>
                                                                {new Date(review.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        background: "#fffbf0", border: "1px solid #fce8a0",
                                                        color: "#a16207", borderRadius: 7, padding: "3px 8px",
                                                        fontSize: 12, fontWeight: 700,
                                                        display: "flex", alignItems: "center", gap: 3,
                                                    }}>
                                                        <FaStar size={10} color="#f5a623" /> {review.rating}
                                                    </div>
                                                </div>
                                                <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                                                    "{review.reviewText}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        textAlign: "center", padding: "40px 20px",
                                        border: "2px dashed #f0ede8", borderRadius: 12,
                                    }}>
                                        <div style={{ fontSize: 32, marginBottom: 10 }}>⭐</div>
                                        <p style={{ color: "#c0b8b0", fontSize: 14, margin: 0 }}>No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ======= RECOMMENDATIONS SECTION ======= */}
                <div className="section-card recs-section" style={{ marginTop: 24 }}>
                    <div style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #f0ede8",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <div style={{
                                width: 32, height: 32, background: "#fff5f0",
                                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <CategoryIcon size={14} color="#F85606" />
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}>
                                You May Also Like
                            </span>
                            <span style={{
                                background: "#fff5f0", color: "#F85606",
                                fontSize: 12, fontWeight: 600,
                                padding: "4px 10px", borderRadius: 8,
                                border: "1px solid #fdd3bd",
                                display: "flex", alignItems: "center", gap: 5,
                            }}>
                                <CategoryIcon size={10} /> {item.category}
                            </span>
                            {/* Algorithm badges legend */}
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {Object.entries(BADGE_CONFIG).map(([label, cfg]) => (
                                    <span key={label} style={{
                                        background: cfg.bg, color: cfg.color,
                                        fontSize: 10, fontWeight: 600,
                                        padding: "3px 8px", borderRadius: 6,
                                        border: `1px solid ${cfg.border}`,
                                    }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            style={{
                                fontSize: 13, color: "#F85606", fontWeight: 600,
                                background: "none", border: "1.5px solid #fdd3bd",
                                borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                            onClick={() => navigate("/shops")}
                        >
                            See All
                        </button>
                    </div>

                    <div style={{ padding: "20px 24px" }}>
                        {recLoading ? (
                            <div style={{ textAlign: "center", padding: 30 }}><ClipLoader size={28} color="#F85606" /></div>
                        ) : recommendations.length > 0 ? (
                            <>
                                <div
                                    className="recs-grid"
                                    style={{ display: "grid", gridTemplateColumns: `repeat(${RECS_PER_ROW}, 1fr)`, gap: 12 }}
                                >
                                    {(showAllRecs ? recommendations : recommendations.slice(0, RECS_PER_ROW)).map(rec => {
                                        const cfg = BADGE_CONFIG[rec._recBadge] || BADGE_CONFIG["Popular"];
                                        return (
                                            <div
                                                key={rec._id}
                                                className="rec-card"
                                                onClick={() => navigate(`/item/${rec._id}`)}
                                            >
                                                <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", background: "#f9f7f4", position: "relative" }}>
                                                    <img
                                                        src={rec.image}
                                                        alt={rec.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                    />
                                                    <div style={{ position: "absolute", top: 7, left: 7 }}>
                                                        {rec.foodType === "veg"
                                                            ? <span className="badge-veg"><FaLeaf size={8} /></span>
                                                            : <span className="badge-nonveg"><FaDrumstickBite size={8} /></span>}
                                                    </div>
                                                    {rec._recBadge && (
                                                        <div style={{
                                                            position: "absolute", bottom: 7, right: 7,
                                                            background: cfg.bg, color: cfg.color,
                                                            fontSize: 9, fontWeight: 700,
                                                            padding: "3px 7px", borderRadius: 6,
                                                            border: `1px solid ${cfg.border}`,
                                                        }}>
                                                            {rec._recBadge}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ padding: "10px 12px 38px" }}>
                                                    <div style={{
                                                        fontSize: 13, fontWeight: 600, color: "#1a1a1a",
                                                        marginBottom: 4, lineHeight: 1.4,
                                                        overflow: "hidden", display: "-webkit-box",
                                                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                                    }}>
                                                        {rec.name}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
                                                        <FaStar color="#f5a623" size={11} />
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                                                            {rec.rating?.average?.toFixed(1) || "0.0"}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: "#c0b8b0" }}>({rec.rating?.count || 0})</span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                        <span style={{ fontSize: 11, color: "#F85606", fontWeight: 600 }}>Rs.</span>
                                                        <span style={{ fontSize: 15, fontWeight: 700, color: "#F85606" }}>{rec.price}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="rec-cart-btn"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        dispatch(addToCart({
                                                            id: rec._id, name: rec.name, price: rec.price,
                                                            image: rec.image, shop: rec.shop, quantity: 1, foodType: rec.foodType,
                                                        }));
                                                    }}
                                                >
                                                    <FaShoppingCart size={11} style={{ display: "inline", marginRight: 5 }} />
                                                    Add to Cart
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {recommendations.length > RECS_PER_ROW && (
                                    <div style={{ textAlign: "center", marginTop: 20 }}>
                                        <button
                                            onClick={() => setShowAllRecs(prev => !prev)}
                                            style={{
                                                background: showAllRecs ? "white" : "#F85606",
                                                color: showAllRecs ? "#F85606" : "white",
                                                border: "1.5px solid #F85606",
                                                borderRadius: 10, padding: "9px 28px",
                                                fontSize: 13, fontWeight: 600,
                                                cursor: "pointer", fontFamily: "inherit",
                                                transition: "background 0.18s, color 0.18s",
                                            }}
                                        >
                                            {showAllRecs
                                                ? "Show Less ▲"
                                                : `Show ${recommendations.length - RECS_PER_ROW} More ▼`}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: `repeat(${RECS_PER_ROW}, 1fr)`, gap: 12 }}>
                                {Array.from({ length: RECS_PER_ROW }).map((_, i) => (
                                    <div key={i} style={{ background: "#faf9f7", borderRadius: 12, overflow: "hidden" }}>
                                        <div className="skeleton" style={{ aspectRatio: "1/1" }} />
                                        <div style={{ padding: 12 }}>
                                            <div className="skeleton" style={{ height: 12, marginBottom: 8 }} />
                                            <div className="skeleton" style={{ height: 12, width: "60%" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default ItemDetails;
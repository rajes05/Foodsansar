import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import { FaStore, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ShopsPage = () => {
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchAllShops = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/shop/get-all`, { withCredentials: true });
            setShops(response.data);
            setFilteredShops(response.data);
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllShops();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const filtered = shops.filter(shop => 
            shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredShops(filtered);
    }, [searchTerm, shops]);

    return (
        <div className="min-h-screen flex flex-col bg-[#fff9f6]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Nav />
            
            <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
                    <div className="inline-flex items-center justify-center p-3 bg-[#ff4d2d]/10 rounded-full text-[#ff4d2d] mb-4">
                        <FaStore size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Explore All <span className="text-[#ff4d2d]">Shops</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover the best local eateries and stores in your area. Freshness delivered to your doorstep.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-10 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Search shops by name or city..."
                        className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent transition-all outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Shops Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ClipLoader color="#ff4d2d" size={50} />
                        <p className="mt-4 text-gray-500 font-medium tracking-wide">Cooking up your list of shops...</p>
                    </div>
                ) : filteredShops.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {filteredShops.map((shop, index) => (
                            <div 
                                key={shop._id} 
                                className="group transform transition-all duration-300 hover:-translate-y-2 animate-[slideUp_0.5s_ease-out]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div 
                                    className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/shop/${shop._id}`)}
                                >
                                    <div className="aspect-square w-full overflow-hidden">
                                        <img 
                                            src={shop.image} 
                                            alt={shop.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 text-lg truncate mb-1 group-hover:text-[#ff4d2d] transition-colors">
                                            {shop.name}
                                        </h3>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <FaMapMarkerAlt className="mr-1.5 flex-shrink-0 text-[#ff4d2d]/70" />
                                            <span className="truncate">{shop.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                        <div className="text-5xl mb-4">🏪</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No shops found</h3>
                        <p className="text-gray-500">We couldn't find any shops matching your search. Try a different term!</p>
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ShopsPage;

import { useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { useSelector } from "react-redux";

function HeroSection() {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);

    return (
        <section className="min-h-screen bg-[#fff9f6] pt-20 flex items-center justify-center px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
                {/* Left Content */}
                <div className="flex flex-col gap-8">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-2 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full text-sm font-semibold">
                            ✨ Delicious Food Delivered
                        </span>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Your Favorite Food,
                            <span className="text-[#ff4d2d]"> Delivered Fast</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Discover restaurants near you and order your favorite dishes.
                            Fast delivery, fresh food, and great taste guaranteed.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={userData? "#shop-by-city" : undefined}  // only use href if userdata exists
                            onClick={userData ? undefined : () => navigate("/signIn")} // only navigate if userdata not present
                            className="px-8 py-4 bg-[#ff4d2d] text-white font-semibold rounded-lg hover:bg-[#e64528] transition text-center"
                        >
                            Order Now
                        </a>
                      

                        <a
                            href={!userData ? "#how-it-works" : undefined}   // only use href if userdata don't exists
                            onClick={!userData ? undefined : () => navigate("/about-us")} // only navigate if userdata present
                            className="px-8 py-4 border-2 border-[#ff4d2d] text-[#ff4d2d] font-semibold rounded-lg hover:bg-[#ff4d2d]/5 transition text-center"
                        >
                            Learn More
                        </a>



                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#ff4d2d]">500+</p>
                            <p className="text-sm text-gray-600">Restaurants</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#ff4d2d]">10k+</p>
                            <p className="text-sm text-gray-600">Happy Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#ff4d2d]">30min</p>
                            <p className="text-sm text-gray-600">Avg Delivery</p>
                        </div>
                    </div>
                </div>

                {/* Right Illustration */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-linear-to-br from-[#ff4d2d]/20 to-[#ff4d2d]/5 rounded-full blur-3xl"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                <UtensilsCrossed size={120} className="text-[#ff4d2d]" />
                            </div>
                        </div>

                        <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl animate-bounce">
                            🍔
                        </div>

                        <div
                            className="absolute bottom-20 left-10 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl"
                            style={{ animation: "bounce 2s infinite 0.5s" }}
                        >
                            🍕
                        </div>

                        <div
                            className="absolute bottom-10 right-20 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl"
                            style={{ animation: "bounce 2s infinite 0.3s" }}
                        >
                            🍜
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

// import NavLanding from "../components/NavLanding";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Nav from "../components/Nav";

function LandingPage() {
    return (
        <div className="w-full min-h-screen">
            {/* <NavLanding /> */}
            <Nav/>
            <HeroSection />

            {/* Why Choose Us Section */}
            <section className="py-20 px-4 bg-[#fff9f6]">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
                        Why Choose Us
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-12">
                        <div className="text-center space-y-3 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl">🚀</div>
                            <h3 className="text-xl font-semibold text-gray-800">Fast Delivery</h3>
                            <p className="text-gray-600">
                                Get your food delivered in 30 minutes or less
                            </p>
                        </div>

                        <div className="text-center space-y-3 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl">🍽️</div>
                            <h3 className="text-xl font-semibold text-gray-800">Fresh Food</h3>
                            <p className="text-gray-600">
                                Quality ingredients from the best restaurants
                            </p>
                        </div>

                        <div className="text-center space-y-3 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl">💯</div>
                            <h3 className="text-xl font-semibold text-gray-800">Easy Payment</h3>
                            <p className="text-gray-600">
                                Multiple payment options for your convenience
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works - learn more */}
            <section id="how-it-works" className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-[#ff4d2d] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Sign Up</h3>
                            <p className="text-gray-600">
                                Create your account in seconds and get started
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-[#ff4d2d] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Browse</h3>
                            <p className="text-gray-600">
                                Explore hundreds of restaurants near you
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-[#ff4d2d] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Order</h3>
                            <p className="text-gray-600">
                                Place your order and customize as you like
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-[#ff4d2d] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                4
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Enjoy</h3>
                            <p className="text-gray-600">
                                Receive your food hot and fresh at your door
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default LandingPage;

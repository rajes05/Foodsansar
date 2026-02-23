// import NavLanding from "../components/NavLanding";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Nav from "../components/Nav";
import { FiZap, FiStar, FiCreditCard } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineClipboardList, HiOutlineTruck, HiOutlineEmojiHappy } from "react-icons/hi";
import { RiRestaurantLine, RiMotorbikeLine } from "react-icons/ri";
import { MdOutlineStorefront } from "react-icons/md";
import { BsGraphUp, BsShieldCheck } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";

function LandingPage() {
    return (
        <div className="w-full min-h-screen">
            <Nav />
            <HeroSection />

            {/* ===== Why Choose Us Section ===== */}
            <section className="py-24 px-4 bg-[#fff9f6]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <span className="text-[#ff4d2d] text-sm font-semibold uppercase tracking-widest">
                            Why Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                            Built for people <br className="hidden md:block" />
                            who love good food
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="group bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#ff4d2d]/30 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-[#fff0ed] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff4d2d] transition-colors duration-300">
                                <FiZap className="w-5 h-5 text-[#ff4d2d] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">30-min delivery</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We track every order in real time and guarantee your food arrives hot, fast, and on time — every time.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#ff4d2d]/30 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-[#fff0ed] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff4d2d] transition-colors duration-300">
                                <FiStar className="w-5 h-5 text-[#ff4d2d] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated restaurants</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Every restaurant on our platform is vetted for quality. No fillers — just the spots actually worth ordering from.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#ff4d2d]/30 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-[#fff0ed] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ff4d2d] transition-colors duration-300">
                                <FiCreditCard className="w-5 h-5 text-[#ff4d2d] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hassle-free checkout</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Card, wallet, or cash on delivery — pay however you want with zero friction and full security.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== End Why Choose Us Section ===== */}

            {/* ====== How It Works ===== */}
            <section id="how-it-works" className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <span className="text-[#ff4d2d] text-sm font-semibold uppercase tracking-widest">
                            The process
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                            Order in 4 steps,<br className="hidden md:block" />
                            eat in 30 minutes
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gray-100 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
                            {[
                                {
                                    icon: <HiOutlineLocationMarker className="w-5 h-5" />,
                                    step: "01",
                                    title: "Sign up",
                                    desc: "Create your account and set your delivery address.",
                                },
                                {
                                    icon: <RiRestaurantLine className="w-5 h-5" />,
                                    step: "02",
                                    title: "Browse",
                                    desc: "Explore local restaurants filtered by cuisine, rating, or distance.",
                                },
                                {
                                    icon: <HiOutlineClipboardList className="w-5 h-5" />,
                                    step: "03",
                                    title: "Order",
                                    desc: "Pick your items, add any customizations, and checkout.",
                                },
                                {
                                    icon: <HiOutlineTruck className="w-5 h-5" />,
                                    step: "04",
                                    title: "Enjoy",
                                    desc: "Your food arrives fresh. Track it live on the map.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#fff0ed] border border-[#ffd5cc] flex items-center justify-center text-[#ff4d2d]">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 font-mono">{item.step}</span>
                                        <h3 className="text-base font-semibold text-gray-900 mt-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* ====== End How It Works ===== */}

            {/* ===== List Your Restaurant Section ===== */}
            <section id="join-ul" className="py-24 px-4 bg-gray-950 text-white overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <span className="inline-block bg-white/10 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                            For Restaurant Owners
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Grow your restaurant <br className="hidden md:block" />
                            with us
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                            Join thousands of restaurants already growing their revenue through our platform. Get access to a ready customer base, real-time analytics, and dedicated support.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: <BsGraphUp className="w-4 h-4" />, text: "Reach more customers without extra marketing spend" },
                                { icon: <TbClockHour4 className="w-4 h-4" />, text: "Flexible hours — you're always in control of your menu" },
                                { icon: <BsShieldCheck className="w-4 h-4" />, text: "Weekly payouts, zero hidden fees" },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="mt-0.5 text-[#ff4d2d] shrink-0">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e03d1f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                        >
                            <MdOutlineStorefront className="w-5 h-5" />
                            List your restaurant
                        </a>
                    </div>

                    {/* Right — Stats panel */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: "3,000+", label: "Active customers" },
                            { value: "Rs 1.1L", label: "Avg. monthly revenue per partner" },
                            { value: "4.1★", label: "Platform rating" },
                            { value: "24 hrs", label: "Onboarding time" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ===== End List Your Restaurant Section ===== */}

            {/* ===== Delivery Partner Section ===== */}
            <section id="join-us" className="py-24 px-4 bg-[#fff9f6]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left — Visual */}
                    <div className="order-2 md:order-1">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-sm mx-auto md:mx-0">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#ff4d2d] rounded-full flex items-center justify-center">
                                    <RiMotorbikeLine className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Today's earnings</p>
                                    <p className="text-xs text-gray-400">8 deliveries completed</p>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-gray-900 mb-1">Rs 1,240</p>
                            <p className="text-xs text-green-500 mb-6">+18% from yesterday</p>
                            <div className="space-y-3">
                                {["Lunch rush bonus  +Rs 120", "Peak hour bonus  +Rs 80", "Base earnings  +Rs 1,040"].map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm text-gray-500 border-b border-gray-50 pb-2 last:border-0">
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="order-1 md:order-2">
                        <span className="inline-block bg-[#fff0ed] text-[#ff4d2d] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                            For Delivery Partners
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Earn on your <br className="hidden md:block" />
                            own schedule
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                            Ride when you want, earn what you deserve. No targets, no pressure. Just pick up orders, deliver, and get paid weekly directly to your bank.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                "Flexible hours — you decide when to go online",
                                "Performance bonuses during peak hours",
                                "Free delivery bag and safety kit on joining",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#ff4d2d] shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="/signup"
                            className="inline-flex items-center gap-2 border-2 border-[#ff4d2d] text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                        >
                            <RiMotorbikeLine className="w-5 h-5" />
                            Become a delivery partner
                        </a>
                    </div>
                </div>
            </section>
            {/* ===== End Delivery Partner Section ===== */}

            <Footer />
        </div>
    );
}

export default LandingPage;
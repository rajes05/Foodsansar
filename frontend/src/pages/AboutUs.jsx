import NavLanding from "../components/NavLanding";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const {userData} = useSelector(state=>state.user);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-white">

        {/* Back Button */}
      <button
        className="fixed top-6 left-4 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm"
        onClick={() => navigate(-1)}
      >
         <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* Hero Section */}
      <section className="bg-[#fff9f6] py-20 px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          About <span className="text-[#ff4d2d]">FoodSansar</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
          FoodSansar is your favorite food delivery service in Nepal. We connect you with
          top restaurants and ensure your meals are delivered fresh, fast, and hot to your
          doorstep.
        </p>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              To provide fast, reliable, and delicious food delivery service while supporting local restaurants and ensuring customer satisfaction.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-gray-600 text-lg">
              To become the leading food delivery platform in Nepal, offering convenience, quality, and a delightful experience for every food lover.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-[#fff9f6]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Meet Our Team
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-64">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900">Rajesh Rana</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 w-64">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900">Suraj Pandey</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;

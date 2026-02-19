import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../public/combination_mark.png'

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4"
        onClick={()=>navigate("/")}
        >
          {/* <h2 className="text-2xl font-bold text-[#ff4d2d]">FoodSansar</h2> */}
          <div className="flex items-center justify-start cursor-pointer">
          <img src={Logo} alt="FoodSansar" className='h-10 md:h-10 object-contain' />
          </div>
          <p className="text-sm leading-relaxed">
            Your favorite food delivery service. Fresh, fast, and delicious meals
            delivered right to your door.
          </p>

          <div className="flex gap-4 pt-2">
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#ff4d2d] transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#ff4d2d] transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#ff4d2d] transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li onClick={() => navigate("/about-us")}><a href="#" className="hover:text-[#ff4d2d]">About Us</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">Our Menu</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">Partner with Us</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">Careers</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#ff4d2d]">Help Center</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#ff4d2d]">FAQs</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-[#ff4d2d]" />
              <span>Putalisadak, Kathmandu 44600, Nepal</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-[#ff4d2d]" />
              <span>+977 9801234567</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-[#ff4d2d]" />
              <span>info@foodsansar.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm">
        © {new Date().getFullYear()} FoodSansar. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

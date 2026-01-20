import React from "react";
import { useNavigate } from "react-router-dom";

function NavLanding() {
  const navigate = useNavigate();

  return (
    <nav className="w-full h-20 flex items-center justify-between px-6 md:px-12 fixed top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#ff4d2d] cursor-pointer"
          onClick={() => navigate("/")}
        >
          FoodSansar
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => navigate("/signin")}
          className="px-4 md:px-6 py-2 text-sm md:text-base font-medium text-[#ff4d2d] hover:text-[#e64528] transition-colors"
        >
          Sign In
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-4 md:px-6 py-2 text-sm md:text-base font-medium text-white bg-[#ff4d2d] rounded-full hover:bg-[#e64528] transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default NavLanding;

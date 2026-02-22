import React from "react";
import { useNavigate } from "react-router-dom";

function GuestNav() {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== LOGO ===== */}
      <div
        className='flex items-center justify-center h-20 cursor-pointer'
        onClick={() => navigate("/")}
      >
        <img src="/combination_mark.png" alt="FoodSansar" className='h-16 md:h-18 object-contain' />
      </div>
      {/* ===== END LOGO ===== */}

      {/* ===== CENTER NAV LINKS (desktop only) ===== */}
      <div className='hidden md:flex items-center gap-1 flex-1 justify-center'>
        <a
          href="#how-it-works"
          className='text-sm font-medium text-gray-500 px-4 py-2 rounded-lg hover:text-gray-900 hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d] transition-all duration-150'
        >
          How it works
        </a>
        <a
          href="#"
          className='text-sm font-medium text-gray-500 px-4 py-2 rounded-lg hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d] transition-all duration-150'
        >
          Restaurants
        </a>
        <a
          href="#"
          className='text-sm font-medium text-gray-500 px-4 py-2 rounded-lg hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d] transition-all duration-150'
        >
          Deals
        </a>
      </div>
      {/* ===== END CENTER NAV LINKS ===== */}

      {/* ===== RIGHT ACTIONS ===== */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => navigate("/signin")}
          className='hidden md:flex items-center text-sm font-semibold text-gray-700 px-4 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#ff4d2d] hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d] transition-all duration-150 cursor-pointer'
        >
          Sign In
        </button>

        <button
          onClick={() => navigate("/signup")}
          className='flex items-center text-sm font-semibold text-white bg-[#ff4d2d] px-4 py-2 rounded-full hover:bg-[#e64528] transition-all duration-150 shadow-md cursor-pointer'
        >
          Get Started
        </button>
      </div>
      {/* ===== END RIGHT ACTIONS ===== */}
    </>
  );
}

export default GuestNav;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuReceipt } from "react-icons/lu";


export const DeliveryBoyNav = ({ userData, handleLogOut, myOrders }) => {
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(false)
    return (
        <>
            {/* ===== LOGO =====  */}
            <div
                className='flex items-center justify-center h-20 cursor-pointer'
                onClick={() => navigate("/")}
            >
                <img src="/combination_mark.png" alt="FoodSansar" className='h-16 md:h-18 object-contain' />
            </div>
            {/* ===== END OF LOGO =====  */}

            {/* ===== my orders ===== */}
            <div className=' left-120 hidden md:flex items-center gap-2 cursor-pointer relative rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1 font-medium' onClick={() => navigate("/my-orders")}>
                <LuReceipt size={20} />
                <span>My Orders</span>
                {myOrders.length > 0 &&
                    <span
                        className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>
                        {myOrders.length}
                    </span>
                }
            </div>
            {/* ===== End my orders ===== */}

            {/* ===== my profile ===== */}
            <div className='relative'>
                <div className='w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'
                    onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName.slice(0, 1)}
                </div>

                {/* ==== popup profile ==== */}
                {showInfo &&
                    <div className={`absolute top-12 right-0 md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999 animate-[slideDown_0.5s_ease-out]`}>

                        <div className='text-[17px] font-semibold'>{userData.fullName}</div>

                        {/* Log Out Button */}
                        <div className='text-[#ff4d2d] font-semibold cursor-pointer' onClick={handleLogOut}>
                            Log Out
                        </div>

                    </div>
                }
                {/* ==== End Popup Profile ==== */}

            </div>
            {/* ===== End My Profile ===== */}

        </>
    )
}
import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { FaArrowLeft } from "react-icons/fa";
import Footer from '../components/Footer';



function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useSelector(state => state.user);
    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col justify-center '>

            <div className='w-full max-w-[800px] flex flex-col mx-auto p-4 '>

                {/* Your Cart Header  */}
                <div className='flex items-center justify-center gap-5 mb-6 '>

                    {/* Back Button */}
                    <button
                        className="fixed top-6 left-4 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>

                    <h1 className='text-2xl font-bold text-start'>Your Cart</h1>

                </div>

                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-lg text-center m-20 p-10'>Your Cart is Empty</p>
                ) : (<>
                    {/* rendering CartItemCard */}
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>

                    {/* totalAmount  */}
                    <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>
                        <h1 className='text-lg font-semibold'>Total Amount</h1>
                        <span className='text-xl font-bold text-[#ff4d2d]'>
                            Rs {totalAmount}
                        </span>
                    </div>

                    {/* Checkout  */}
                    <div className='mt-4 flex justify-end'>
                        <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer' onClick={() => navigate("/checkout")}>
                            Proceed to CheckOut
                        </button>
                    </div>

                </>
                )}

            </div>


            <Footer />
        </div>
    )
}

export default CartPage;
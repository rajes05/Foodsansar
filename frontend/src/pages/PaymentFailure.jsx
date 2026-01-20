import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdError } from "react-icons/md";

function PaymentFailure() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('error') || 'Payment was cancelled or failed';

    return (
        <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
            <MdError className='text-red-500 text-6xl mb-4' />
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Payment Failed</h1>
            <p className='text-gray-600 max-w-md mb-6'>
                {errorMessage}
            </p>
            <div className='flex gap-4'>
                <button
                    className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition'
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
                <button
                    className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition'
                    onClick={() => navigate("/cart")}
                >
                    Return to Cart
                </button>
            </div>
        </div>
    );
}

export default PaymentFailure;

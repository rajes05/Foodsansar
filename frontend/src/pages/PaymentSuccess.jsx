import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';

function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const orderId = searchParams.get('orderId');
        if (orderId) {
            fetchOrderDetails(orderId);
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, {
                withCredentials: true
            });
            setOrderDetails(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#fff9f6] flex justify-center items-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d]'></div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
            <FaCircleCheck className='text-green-500 text-6xl mb-4' />
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Payment Successful!</h1>
            <p className='text-gray-600 max-w-md mb-2'>
                Your payment has been processed successfully.
            </p>
            {orderDetails && (
                <div className='bg-white rounded-lg shadow-md p-6 mb-6 max-w-md w-full'>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Details</h2>
                    <div className='space-y-2 text-left'>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Order ID:</span>
                            <span className='font-medium text-gray-800'>{orderDetails._id.slice(-8)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Total Amount:</span>
                            <span className='font-medium text-green-600'>Rs {orderDetails.totalAmount}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Payment Status:</span>
                            <span className='font-medium text-green-600'>Completed</span>
                        </div>
                    </div>
                </div>
            )}
            <p className='text-gray-600 max-w-md mb-6'>
                Your order is being prepared. You can track your order status in the "My Orders" section.
            </p>
            <button
                className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition'
                onClick={() => navigate("/my-orders")}
            >
                View My Orders
            </button>
        </div>
    );
}

export default PaymentSuccess;

import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import ReviewModal from './ReviewModal'


function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [modalData, setModalData] = useState({ isOpen: false, item: null, orderId: null });

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRateClick = (item) => {
        setModalData({
            isOpen: true,
            item: item,
            orderId: data._id
        });
    }

    const closeRenviewModal = () => {
        setModalData({ isOpen: false, item: null, orderId: null });
    }

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>

            <div className='flex justify-between border-b pb-2'>

                {/* left div  */}
                <div>
                    <p className='font-semibold'>
                        order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-500'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>

                {/* right div  */}
                <div className='text-right'>
                    <p className='text-sm text-gray-500'>
                        {data.paymentMethod?.toUpperCase()}
                    </p>
                    {data.paymentMethod === 'online' && (
                        <p className={`text-xs font-medium ${data.payment?.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                            {data.payment?.status === 'completed' ? 'Completed' : 'Not Completed'}
                        </p>
                    )}
                    <p className='font-medium text-blue-500'>
                        {data.shopOrders?.[0].status}
                    </p>
                </div>

            </div>

            {/* Mapping Shop Orders  */}
            {data.shopOrders.map((shopOrder, index) => (
                <div className='border rounded-lg p-3 bg-[#fffaf7] space-y-3' key={index}>
                    <p>{shopOrder.shop.name}</p>

                    {/* Mapping shopOrder Items  */}
                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, index) => (
                            <div key={index} className='shrink-0 w-40 border rounded-lg p-2 bg-white '>

                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                <p className='text-sm font-semibold mt-1'>{item.name}</p>
                                <p className='text-xs text-gray-500 '>Qty: {item.quantity} X Rs {item.price}</p>

                                {/* Rating */}

                                {shopOrder.status == "delivered" && <div className='mt-2'>
                                    <button
                                        className='text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition'
                                        onClick={() => handleRateClick(item.item)}
                                    >
                                        Rate Item
                                    </button>
                                </div>}

                            </div>
                        ))}
                    </div>

                    {/* Subtotal  */}
                    <div className='flex justify-between items-center border-t pt-2'>

                        <p className='font-semibold'>Subtotal: Rs {shopOrder.subtotal}</p>
                        <span className='text-sm font-medium text-blue-600'>{shopOrder.status}</span>

                    </div>

                </div>
            ))}

            {/* GrandTotal  */}
            <div className='flex justify-between items-center border-t pt-2'>
                <p className='font-semibold'>
                    Total: Rs {data.totalAmount}
                </p>
                {/* Track Order Button  */}
                <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm' onClick={() => navigate(`/track-order/${data._id}`)}>Track Order</button>
                {/* Review Modal */}
                {modalData.isOpen && (
                    <ReviewModal
                        isOpen={modalData.isOpen}
                        onClose={closeRenviewModal}
                        itemId={modalData.item._id}
                        orderId={modalData.orderId}
                        itemImage={modalData.item.image}
                        itemName={modalData.item.name}
                    />
                )}

            </div>

        </div>
    )
}

export default UserOrderCard;
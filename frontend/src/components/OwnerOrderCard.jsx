import axios from 'axios';
import React from 'react'
import { MdPhone } from "react-icons/md";
import { MdMail } from "react-icons/md";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';



function OwnerOrderCard({ data }) {

    const [availableBoys, setAvailableBoys] = useState([]);
    const dispatch = useDispatch();

    //handling function
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true });

            // console.log(result.data);
            dispatch(updateOrderStatus({ orderId, shopId, status }));
            setAvailableBoys(result.data.availableBoys)
            console.log(result.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>

            {/* userInfo  */}
            <div>
                <h2 className='text-lg font-semibold text-gray-800 '>{data.user.fullName}</h2>
                <p className='flex items-center gap-2 text-sm text-gray-500'>
                    <MdMail />
                    {data.user.email}
                </p>
                <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
                    <MdPhone />
                    <span>{data.user.mobile}</span>
                </p>
            </div>

            {/* userAddress  */}
            <div className='flex items-start flex-col gap-2 text-gray-600 text-sm'>
                <p>
                    {data?.deliveryAddress?.text}
                </p>
                <p className='text-xs text-gray-500'>
                    Lat: {data.deliveryAddress.latitude} ,
                    Lon: {data.deliveryAddress.longitude}
                </p>
            </div>

            {/* orderItems  */}
            {/* Mapping shopOrders Items  */}
            <div className='flex space-x-4 overflow-x-auto pb-2'>
                {data.shopOrders.shopOrderItems.map((item, index) => (
                    <div key={index} className='shrink-0 w-40 border rounded-lg p-2 bg-white '>

                        <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                        <p className='text-sm font-semibold mt-1'>{item.name}</p>
                        <p className='text-xs text-gray-500 '>Qty: {item.quantity} X Rs {item.price}</p>

                    </div>
                ))}
            </div>

            {/* Status Tracking */}
            <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
                <div className='flex flex-col gap-1'>
                    <span className='text-sm'>
                        Status:
                        <span className='font-semibold capitalize text-[#ff4d2d]'> {data.shopOrders.status}</span>
                    </span>
                    <span className='text-xs text-gray-500'>
                        Payment: {data.paymentMethod?.toUpperCase()}
                        {data.paymentMethod === 'online' && (
                            <span className={`ml-1 font-medium ${data.payment?.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                ({data.payment?.status === 'completed' ? 'Completed' : 'Not Completed'})
                            </span>
                        )}
                    </span>
                </div>

                <select className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]' onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Change Status</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                </select>

            </div>

            {/* available deliveryBoys  */}
            {data.shopOrders.status == "out for delivery" &&
                <div className='mt-3 p-2 border rounded-lg text-sm border-orange-500'>
                    {data.shopOrders.assignedDeliveryBoy ?
                        <p>Assigned Delivery Boy:</p> :
                        <p>Available Delivery Boys:</p>}
                    {availableBoys.length > 0 ? (
                        availableBoys.map((b, index) => (
                            <div className='text-gray-500'>{b.fullName} - {b.mobile}</div>
                        ))
                    ) : data.shopOrders.assignedDeliveryBoy ?
                        <div>
                            {data.shopOrders.assignedDeliveryBoy.fullName}-{data.shopOrders.assignedDeliveryBoy.mobile}
                        </div> : <div>
                            Waiting for delivery boy to accept
                        </div>}
                </div>}

            {/* Total Amount  */}
            <div className='text-right font-bold text-gray-800 text-sm'>
                Total: Rs {data.shopOrders.subtotal}
            </div>

        </div>
    )
}

export default OwnerOrderCard
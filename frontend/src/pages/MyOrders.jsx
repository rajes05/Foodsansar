import React from 'react'
import { useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { FaArrowLeft } from "react-icons/fa";
import Footer from '../components/Footer';



function MyOrders() {

  const { userData, myOrders } = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center justify-center'>

      <div className='w-full max-w-[800px] p-4'>

        {/* My Orders Header Div*/}
        <div className='flex items-center justify-center gap-5 mb-6 '>

          {/* Back Button */}
          <button
            className="fixed top-6 left-4 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <h1 className='text-2xl font-bold text-center'>My Orders</h1>

        </div>
        {/* *End My Orders Header Div  */}

        {/* Maping Orders  */}
        <div className='space-y-6'>

          {myOrders?.map((order, index) => (
            userData.role == "user" ?
              (
                <UserOrderCard data={order} key={index} />
              )
              :
              userData.role == "owner" ? (

                <OwnerOrderCard data={order} key={index} />
              )
                : null
          ))}

        </div>
        {/* *End Maping Orders  */}

      </div>

      <Footer />

    </div>
  )
}

export default MyOrders
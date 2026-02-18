import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import Footer from '../components/Footer';
import RollBackButton from '../components/ui/RollBackButton';



function MyOrders() {

  const { userData, myOrders } = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center justify-center'>

      <div className='w-full max-w-[800px] p-4'>

        {/* My Orders Header Div*/}
        <div className='flex items-center justify-center gap-5 mb-6 '>

          {/* ===== Rollback Button ===== */}
            <RollBackButton to="/" />
          {/* ===== End Rollback Button ===== */}

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
import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import DeliveryBoy from '../components/DeliveryBoy';
import AdminDashboard from './AdminDashboard';

function Home() {
  const { userData } = useSelector(state => state.user); // Get user data from redux store

  return (
    <div className='w-screen min-h-screen pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData?.role == "user" && <UserDashboard />}
      {userData?.role == "owner" && <OwnerDashboard />}
      {userData?.role == "deliveryBoy" && <DeliveryBoy />}
      {userData?.role == "ADMIN" && <AdminDashboard />}
    </div>
  )
}

export default Home;
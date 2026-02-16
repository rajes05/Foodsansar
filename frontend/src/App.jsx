import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import useGetShopByCity from './hooks/useGetShopByCity';
import useGetItemsByCity from './hooks/useGetItemsByCity';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrders from './hooks/useGetMyOrders';
import useUpdateLocation from './hooks/useUpdateLocation';
import TrackOrderPage from './pages/TrackOrderPage';
import Shop from './pages/Shop';
import ItemDetails from './pages/ItemDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';

export const serverUrl = "http://localhost:8000"; // Backend server URL

function App() {
  useGetCurrentUser(); //  Custom hook to fetch current user data
  useGetCity(); // Custom hook to fetch city data
  useGetMyShop(); // Custom hook to fetch current user's shop data
  useGetShopByCity(); // Custom hook to fetch Shop by city
  useGetItemsByCity(); // Custom hook to fetch Item by city
  useGetMyOrders(); // Custom hook to fetch Orders
  useUpdateLocation();

  const { userData, isLoading } = useSelector(state => state.user); // Get user data from redux store

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#fff9f6]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ff4d2d]"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path='/landing-page' element={!userData ? <LandingPage /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to={"/landing-page"} />} />
        <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />} />
        <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to={"/signin"} />} />
        <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />
        <Route path='/cart' element={userData ? <CartPage /> : <Navigate to={"/signin"} />} />
        <Route path='/checkout' element={userData ? <CheckOut /> : <Navigate to={"/signin"} />} />
        <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />} />
        <Route path='/payment-success' element={userData ? <PaymentSuccess /> : <Navigate to={"/signin"} />} />
        <Route path='/payment-failure' element={userData ? <PaymentFailure /> : <Navigate to={"/signin"} />} />
        <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to={"/signin"} />} />
        <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />} />
        <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to={"/signin"} />} />
        <Route path='/item/:itemId' element={userData ? <ItemDetails /> : <Navigate to={"/signin"} />} />
        <Route path='/about-us' element={<AboutUs />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App;
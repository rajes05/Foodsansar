import { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa";
import { LuReceipt } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import SearchBar from './composite/SearchBar';
import GuestNav from './nav/GuestNav';


function Nav() {

  //  fetch userData from redux store

  const { userData, currentCity, cartItems, myOrders } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });

      // removes the stored user information from the Redux state

      dispatch(setUserData(null));

    } catch (error) {
      console.log(error);
    }
  }

  return (
    // Container Div
    <div className='fixed top-0 w-full h-20 flex items-center justify-between px-5  z-9999 bg-[#fff9f6] overflow-visible'>

      {/* ====== User Based Nav ====== */}
      <>

        {/* ====== 1. Guenst User Nav ======  */}
        {userData === null && (
          <GuestNav/>
        )}
        {/* ====== End 1. Guenst User Nav======  */}

        {/* ====== 2. User Nav ======  */}
        {userData !== null && (
          <>

            {/* ===== LOGO =====  */}
            <div
              className='flex items-center justify-center h-20 cursor-pointer'
              onClick={() => navigate("/")}
            >
              <img src="/combination_mark.png" alt="FoodSansar" className='h-16 md:h-18 object-contain' />
            </div>
            {/* ===== END OF LOGO =====  */}

            <>

              {/* ===== popup search Bar ====== */}
              {showSearch && userData.role === "user" &&
                <SearchBar currentCity={currentCity}
                  className={`w-[90%] flex fixed top-20 left-[5%] animate-[slideDown_0.5s_ease-out]`}
                />}
              {/* ===== End popup search Bar ===== */}

              {/* ====== Normal Search Bar ====== */}
              {userData.role === "user" &&
                <SearchBar currentCity={currentCity}
                  className={`md:w-[60%] lg:w-[40%] md:flex hidden`}
                />
              }
              {/* ===== end Normal Search Bar ===== */}

              {/* ===== right nav section ===== */}
              <div className='flex items-center gap-4'>

                {/* search icon and cross  for small devices */}

                {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() => setShowSearch(false)} /> :
                  <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() => setShowSearch(true)} />)}

                {/* Right Nav component */}

                {userData.role == "owner" ? (
                  // for Owner
                  <>
                    {myShopData && <><button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate("/add-item")}>
                      <FaPlus size={20} />
                      <span>Add Food Item</span>
                    </button>

                      <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate("/add-item")}>
                        <FaPlus size={20} />
                      </button> </>}


                    {/* My Orders for large devices */}

                    <div className='hidden md:flex items-center gap-2 cursor-pointer relative rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1 font-medium' onClick={() => navigate("/my-orders")}>
                      <LuReceipt size={20} />
                      <span>My Orders</span>
                      <span className='absolute -right-2 -top-2 text-xs fond-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>{myOrders.length}</span>
                    </div>

                    {/* My Orders for small devices */}

                    <div className='md:hidden flex items-center gap-2 cursor-pointer relative rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1 font-medium' onClick={() => navigate("/my-orders")}>
                      <LuReceipt size={20} />
                      <span className='absolute -right-2 -top-2 text-xs fond-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>{myOrders.length}</span>
                    </div>
                  </>
                ) : (

                  // for user

                  <>

                    {/* cart */}
                    {userData.role == "user" &&
                      <div className='relative cursor-pointer' onClick={() => navigate("/cart")}>

                        <FiShoppingCart size={25} className='text-[#ff4d2d]' />
                        {cartItems.length > 0 && (
                          <span className='absolute right-[-9px] -top-3 text-[#ff4d2d]'>
                            {cartItems.length}
                          </span>
                        )
                        }

                      </div>
                    }


                    {/* my orders for User */}
                    <div className='hidden md:flex items-center gap-2 cursor-pointer relative rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] px-3 py-1 font-medium' onClick={() => navigate("/my-orders")}>
                      <LuReceipt size={20} />
                      <span>My Orders</span>
                      {myOrders.length > 0 &&
                        <span
                          className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>
                          {myOrders.length}
                        </span>
                      }
                    </div>
                    {/* End my orders for user */}

                  </>

                )}

                {/* my profile  */}
                <div className='relative'>
                  <div className='w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'
                    onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName.slice(0, 1)}
                  </div>

                  {/* ==== popup profile ==== */}
                  {showInfo &&
                    <div className={`absolute top-12 right-0 ${userData.role == "deliveryBoy" ? "md:right-[20%] lg:right-[40%]" : "md:right-[10%] lg:right-[25%]"}  w-[180px] bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999 animate-[slideDown_0.5s_ease-out]`}>

                      <div className='text-[17px] font-semibold'>{userData.fullName}</div>

                      {/* Show 'My Orders' when role=user */}

                      {userData.role == "user" &&
                        <div className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer' onClick={() => navigate("/my-orders")}>My Orders</div>
                      }
                      <div className='text-[#ff4d2d] font-semibold cursor-pointer' onClick={handleLogOut}>
                        Log Out
                      </div>

                    </div>
                  }
                  {/* ==== End Popup Profile ==== */}

                </div>
                {/* *End My Profile  */}


              </div>
              {/* ===== end right nav section ===== */}

            </>

          </>
        )}
        {/* ====== End 2. User Nav ======  */}

      </>



      {/* ====== User Based Nav ====== */}


    </div>
  );
}

export default Nav;
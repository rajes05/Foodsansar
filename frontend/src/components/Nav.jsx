import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa";
import { LuReceipt } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import Logo from '../../public/combination_mark.png';


function Nav() {

  //  fetch userData from redux store

  const { userData, currentCity, cartItems, myOrders } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle function

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });

      // removes the stored user information from the Redux state

      dispatch(setUserData(null));

    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
      dispatch(setSearchItems(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (query) {
      handleSearchItems()
    } else {
      dispatch(setSearchItems(null))
    }

  }, [query])

  return (
    <div className='w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible'>

      {/* ===== popup search ====== */}
      {showSearch && userData.role == "user" && <div className='w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 flex fixed top-20 left-[5%]'>

        {/* location display */}

        <div className='flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400'>

          <FaLocationDot size={25} className=' text-[#ff4d2d]' />
          <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
        </div>

        {/* search input */}

        <div className='w-[80%] flex items-center gap-2.5'>

          <IoIosSearch size={25} className='text-[#ff4d2d]' />
          <input type="text" placeholder='Search delicious food...' className='px-2.5 text-gray-700 outline-0 w-full' onChange={(e) => setQuery(e.target.value)} value={query} />

        </div>
      </div>}
      {/* ===== end popup search ===== */}

        {/* ===== LOGO ===== */}
      {/* <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>FoodSansar</h1> */}
      <img src={Logo} alt="FoodSansar" className='h-12 md:h-14 mb-2 object-contain'/>
      {/* ===== END OF LOGO ===== */}

      {/* ====== mid nav section ====== */}
      {userData.role == "user" && <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex'>

        {/* location display */}

        <div className='flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400'>

          <FaLocationDot size={25} className=' text-[#ff4d2d]' />
          <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
        </div>

        {/* search input */}

        <div className='w-[80%] flex items-center gap-2.5'>

          <IoIosSearch size={25} className='text-[#ff4d2d]' />
          <input type="text" placeholder='Search delicious food...' className='px-2.5 text-gray-700 outline-0 w-full' onChange={(e) => setQuery(e.target.value)} value={query} />

        </div>
      </div>}
      {/* ===== end mid nav section ===== */}

      {/* ===== right nav section ===== */}
      <div className='flex items-center gap-4'>

        {/* search icon and cross  for small devices */}

        {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} /> :
          <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />)}

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
                <span className='absolute right-[-9px] -top-3 text-[#ff4d2d]'>{cartItems.length}</span>

              </div>
            }


            {/* my order for User */}
            <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium' onClick={() => navigate("/my-orders")}>
              My Orders
            </button>

          </>

        )}

        {/* my profile  */}

        <div className='w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer' onClick={() => setShowInfo(prev => !prev)}>
          {userData?.fullName.slice(0, 1)}
        </div>

        {/* *End My Profile  */}

        {/* popup profile*/}
        {showInfo &&
          <div className={`fixed top-20 right-2.5 ${userData.role == "deliveryBoy" ? "md:right-[20%] lg:right-[40%]" : "md:right-[10%] lg:right-[25%]"}  w-[180px] bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999`}>

            <div className='text-[17px] font-semibold'>{userData.fullName}</div>

            {/* Show 'My Orders' when role=user */}

            {userData.role == "user" &&
              <div className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer' onClick={() => navigate("/my-orders")}>My Orders</div>
            }
            <div className='text-[#ff4d2d] font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</div>

          </div>
        }
        {/* *End Popup Profile  */}

      </div>
      {/* ===== end right nav section ===== */}

    </div>
  );
}

export default Nav;
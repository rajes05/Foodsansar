import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"; // import leaflet css for react
import { setAddress, setLocation } from '../redux/mapSlice';
import { addMyOrder, setCurrentCity } from '../redux/userSlice';
import { getCorrectCityName } from '../utils/cityDetection';
import axios from 'axios';
import { serverUrl } from '../App';
import EsewaPaymentForm from '../components/EsewaPaymentForm';

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null;
}
function CheckOut() {
  const navigate = useNavigate();
  const { location, address } = useSelector(state => state.map);
  const { cartItems, totalAmount, userData } = useSelector(state => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [esewaPaymentData, setEsewaPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;


  const onDragEnd = (e) => {

    // Marker current location
    // console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng;

    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {

    // navigator.geolocation.getCurrentPosition(async (position) => {
    //   // console.log(position);
    //   const latitude = position.coords.latitude;
    //   const longitude = position.coords.longitude;

    // updated 
    const latitude = userData.location.coordinates[1]
    const longitude = userData.location.coordinates[0]
    // Edn updated

    // delivery location
    dispatch(setLocation({ lat: latitude, lon: longitude }))
    getAddressByLatLng(latitude, longitude);
    /* }) */
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`);

      // Get city from Geoapify and correct it using coordinate-based detection
      const geoapifyCity = result?.data?.results[0]?.city;
      const correctedCity = getCorrectCityName(lat, lng, geoapifyCity);

      // Update city in Redux store
      dispatch(setCurrentCity(correctedCity));

      // console.log(result?.data?.results[0].address_line2);
      dispatch(setAddress(result?.data?.results[0].address_line2));

    } catch (error) {
      console.log(error)
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)

      // console.log(result.data.features[0].properties);
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));

      // Also update city when location is set by address search
      getAddressByLatLng(lat, lon);

    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // Create the order first
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon
        },
        totalAmount: AmountWithDeliveryFee,
        cartItems
      }, { withCredentials: true });

      const order = result.data;
      dispatch(addMyOrder(order));

      // If payment method is COD, navigate to order placed page
      if (paymentMethod === "cod") {
        navigate("/order-placed");
      } else {
        // If payment method is online, initiate eSewa payment
        const paymentResult = await axios.post(`${serverUrl}/api/payment/esewa/initiate`, {
          orderId: order._id
        }, { withCredentials: true });

        if (paymentResult.data.success) {
          // Set eSewa payment data to trigger form submission
          setEsewaPaymentData(paymentResult.data.paymentData);
        } else {
          alert("Failed to initiate payment. Please try again.");
          setIsProcessing(false);
        }
      }

    } catch (error) {
      console.log(error);
      alert("Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setAddressInput(address)
  }, [address]);

  // If eSewa payment data is set, show the payment form
  if (esewaPaymentData) {
    return <EsewaPaymentForm paymentData={esewaPaymentData} />;
  }

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>

      {/* ===== Rollback Button ===== */}
      <button
        className="fixed top-6 left-4 z-20 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>
      {/* ===== End Rollback Button ===== */}

      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>

        {/* Set Delivery Location  */}
        <section>

          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'>
            <IoLocationSharp className='text-[#ff4d2d]' />
            Delivery Location
          </h2>

          {/* SearchInput and current location  */}
          <div className='flex gap-2 mb-3'>
            <input type="text" className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter Your Delivery Address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getLatLngByAddress}>
              <IoSearchOutline size={17} />
            </button>
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getCurrentLocation}>
              <TbCurrentLocation size={17} />
            </button>
          </div>

          {/* map  */}
          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer className={'w-full h-full'} center={[location?.lat, location?.lon]} zoom={16}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
              </MapContainer>
            </div>
          </div>
          {/* *End map  */}

        </section>

        {/* set Payment Method  */}
        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

            {/* cod  */}
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setPaymentMethod("cod")}>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>

              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='text-xs text-gray-500'>Pay when your food arrives</p>
              </div>
            </div>

            {/* online  */}
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setPaymentMethod("online")}>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 text-lg' />
              </span>

              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700  text-lg' />
              </span>

              <div>
                <p className='font-medium text-gray-800'>E-Wallet / Credit / Debit Card</p>
                <p className='text-xs text-gray-500'>Pay Securely Online</p>
              </div>

            </div>

          </div>
        </section>

        {/* Order Summary  */}
        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
          <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
            {cartItems.map((item, index) => (
              <div key={index} className='flex justify-between text-sm text-gray-700'>
                <span>{item.name} x {item.quantity}</span>
                <span>Rs {item.price * item.quantity}</span>
              </div>
            ))}
            <hr className='border-gray-200 my-2' />

            {/* Subtotal  */}
            <div className='flex justify-between font-medium text-gray-800'>
              <span>Subtotal</span>
              <span>Rs {totalAmount}</span>
            </div>

            {/* Delivery Fee  */}
            <div className='flex justify-between text-gray-700'>
              <span>Delivery Fee</span>
              <span>{deliveryFee == 0 ? "Free" : "Rs " + deliveryFee}</span>
            </div>

            {/* Total Amount  */}
            <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
              <span>Total</span>
              <span>Rs {AmountWithDeliveryFee}</span>
            </div>

          </div>
        </section>

        {/* Place Order Button  */}
        <button
          className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed'
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : (paymentMethod == "cod" ? "Place Order" : "Pay & Place Order")}
        </button>

      </div>

    </div>
  )
}

export default CheckOut;
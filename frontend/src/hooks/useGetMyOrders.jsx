import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders, setUserData } from '../redux/userSlice';
import { setMyShopData } from '../redux/ownerSlice.js';

// This hook fetches the shop data of the current user and stores it in the Redux store

function useGetMyOrders() {

    //dispatch to send data to redux store
    const dispatch = useDispatch();

    const {userData} = useSelector(state=>state.user);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });


                // store order data inside redux store
                console.log(result.data);
                
                dispatch(setMyOrders(result.data)); 

            } catch (error) {
                console.log(error);
            }
        }
        fetchOrders();
        
    }, [userData]);
}

export default useGetMyOrders;
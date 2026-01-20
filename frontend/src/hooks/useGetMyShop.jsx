import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { setMyShopData } from '../redux/ownerSlice.js';

// This hook fetches the shop data of the current user and stores it in the Redux store

function useGetMyShop() {

    //dispatch to send data to redux store
    const dispatch = useDispatch();

    const {userData} = useSelector(state=>state.user);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true });


                // store shop dato inside redux store
                dispatch(setMyShopData(result.data)); 

            } catch (error) {
                console.log(error);
            }
        }
        fetchShop();
        
    }, [userData]);
}

export default useGetMyShop;
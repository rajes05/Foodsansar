import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });

                dispatch(setUserData(result?.data?.user)); // result.data?.user instead of result.data to avoid undefined error

            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
        
    }, []);
}

export default useGetCurrentUser;
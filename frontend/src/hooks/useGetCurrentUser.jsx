import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData, setLoading } from '../redux/userSlice';

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // dispatch(setLoading(true)); // Already true by default
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });

                dispatch(setUserData(result?.data?.user)); // This also sets isLoading to false
            } catch (error) {
                console.log(error);
                dispatch(setLoading(false)); // Ensure loading stops on error
            }
        }
        fetchUser();

    }, []);
}

export default useGetCurrentUser;
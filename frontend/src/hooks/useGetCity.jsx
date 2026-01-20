import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentProvince } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";
import { getCorrectCityName } from "../utils/cityDetection";

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const {userData} = useSelector(state=>state.user); // to get userData from redux

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // console.log(position);

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // delivery location
      dispatch(setLocation({lat:latitude, lon:longitude}))

      const result =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);

        console.log(result.data);
        // console.log(result.data.results[0].city); 
        // console.log(result.data.results[0].state);
        // console.log(result.data.results[0].address_line2);

        // Get city from Geoapify and correct it using coordinate-based detection
        const geoapifyCity = result?.data?.results[0]?.city || result?.data?.results[0]?.county;
        const correctedCity = getCorrectCityName(latitude, longitude, geoapifyCity);

        dispatch(setCurrentCity(correctedCity)); 
        dispatch(setCurrentProvince(result?.data?.results[0]?.state));
        dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1));
        
        // final delivery location
        // console.log(result.data.results[0]);
        dispatch(setAddress(result?.data?.results[0]?.address_line2));

    });
  },[userData]); // changes when userData changes  [userData, apiKey, dispatch]
}

export default useGetCity;

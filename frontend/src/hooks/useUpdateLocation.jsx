import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentProvince } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";
import { getCorrectCityName } from "../utils/cityDetection";
import { serverUrl } from "../App";

function useUpdateLocation() {
  const dispatch = useDispatch();

  const {userData} = useSelector(state=>state.user); // to get userData from redux

  useEffect(() => {
   const updateLocation = async (lat, lon) => {
    const result = await axios.post(`${serverUrl}/api/user/update-location`,{lat, lon},{withCredentials:true});

    console.log(result.data);
   }

   navigator.geolocation.watchPosition((pos)=>{
    updateLocation(pos.coords.latitude,pos.coords.longitude)
   })

  },[userData]); // changes when userData changes  [userData, apiKey, dispatch]
}

export default useUpdateLocation;

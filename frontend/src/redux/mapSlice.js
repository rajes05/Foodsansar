import { createSlice } from "@reduxjs/toolkit";

// The setUserData function is used to store user information in the Redux state after sign in or sign up.
// userSlice manages user data and currentCity, currentProvince, currentAddress information in the Redux store.

const mapSlice = createSlice({
    name: "user",
    initialState: {
        location:{
            lat:null,
            lon:null
        },
        address:null
    },
    reducers: {
        setLocation:(state, action)=>{
            const {lat, lon} = action.payload;
            state.location.lat=lat;
            state.location.lon=lon;
        },
        setAddress:(state, action)=>{
            state.address=action.payload;
        }
    }
});

export const {setLocation, setAddress} = mapSlice.actions; // Export action creators : use useSelector and useDispatch 
export default mapSlice.reducer; // Export reducer
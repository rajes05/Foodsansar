import { createSlice } from "@reduxjs/toolkit";

// ownerSlice manages shop data of the owner in the Redux store.

const ownerSlice = createSlice({
    name: "owner",
    initialState: {
        myShopData: null
    },
    reducers: {
        setMyShopData: (state, action) => {
            state.myShopData = action.payload; // Set user data
        }
    }
});

export const { setMyShopData } = ownerSlice.actions; // Export action creators
export default ownerSlice.reducer; // Export reducer
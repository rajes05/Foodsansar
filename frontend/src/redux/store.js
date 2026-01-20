import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import mapSlice from "./mapSlice";

// setting up the redux store and combining all the slices

export const store = configureStore({
    reducer: {
        user:userSlice, // User slice reducer
        owner:ownerSlice, // Owner slice reducer
        map:mapSlice // map slice reducer
    }
});
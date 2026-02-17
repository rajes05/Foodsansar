import { createSlice } from "@reduxjs/toolkit";

// The setUserData function is used to store user information in the Redux state after sign in or sign up.
// userSlice manages user data and currentCity, currentProvince, currentAddress information in the Redux store.

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentProvince: null,
        currentAddress: null,
        shopInMyCity: null,
        itemsInMyCity: null,
        cartItems: [],
        totalAmount: 0,
        myOrders: [],
        searchItems: null,
        isLoading: true, // Add loading state, default to true
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload; // Set user data
            state.isLoading = false; // Stop loading when data is set
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload; // set city
        },
        setCurrentProvince: (state, action) => {
            state.currentProvince = action.payload; // set province
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload; // set address
        },
        setShopsInMyCity: (state, action) => {
            state.shopInMyCity = action.payload; // set shop in city
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload; // set items in city
        },
        addToCart: (state, action) => {
            const cartItem = action.payload
            const existingItem = state.cartItems.find((i => i.id == cartItem.id))
            if (existingItem) {
                // add cartItem quantity to existingItem quantity
                existingItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }
            // console.log(state.cartItems);

            // totalAmount When item added to cart
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(i => i.id == id);
            if (item) {
                item.quantity = quantity;
            }
            //totalAmount when quantity change
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
            // totalAmount when item removed from cart
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
        },
        addMyOrder: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },
        updateOrderStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload;
            const order = state.myOrders.find(o => o._id == orderId);
            if (order) {
                if (order.shopOrders && order.shopOrders.shop._id == shopId) {
                    order.shopOrders.status = status;
                }
            }
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload
        }
    }
});

export const { setUserData, setCurrentCity, setCurrentProvince, setCurrentAddress, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrder, updateOrderStatus, setSearchItems, setLoading } = userSlice.actions; // Export action creators : use useSelector and useDispatch 
export default userSlice.reducer; // Export reducer
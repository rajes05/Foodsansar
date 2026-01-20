import express from 'express';
import { getCurrentUser, updateUserLocation } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js'; // get userId from the cookie token and attach to req.userId

const userRouter = express.Router(); // Create a router for user-related routes

userRouter.get('/current',isAuth, getCurrentUser); // Define route to get current user details
userRouter.post('/update-location', isAuth, updateUserLocation); 

export default userRouter;
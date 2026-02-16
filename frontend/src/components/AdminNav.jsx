import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-hot-toast';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const AdminNav = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/signout`, {}, { withCredentials: true });
            dispatch(setUserData(null));
            navigate("/landing-page");
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <FaUserShield className="text-2xl text-orange-500" />
                        <span className="font-bold text-xl tracking-wider">FoodSansar Admin</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <span className="text-gray-300 text-sm mr-4">Super Admin Dashboard</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;

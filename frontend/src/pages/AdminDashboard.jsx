import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import AdminNav from '../components/AdminNav';
import { toast } from 'react-hot-toast';
import { FaStore, FaBiking, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminDashboard = () => {
    const [shops, setShops] = useState({ data: [], totalPages: 1, page: 1 });
    const [deliveries, setDeliveries] = useState({ data: [], totalPages: 1, page: 1 });
    const [users, setUsers] = useState({ data: [], totalPages: 1, page: 1 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, shops, deliveries, users

    // Separate fetch functions for pagination
    const fetchShops = async (page = 1) => {
        try {
            const res = await axios.get(`${serverUrl}/api/admin/shops?page=${page}&limit=5`, { withCredentials: true });
            setShops(res.data);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    const fetchDeliveries = async (page = 1) => {
        try {
            const res = await axios.get(`${serverUrl}/api/admin/deliveries?page=${page}&limit=5`, { withCredentials: true });
            setDeliveries(res.data);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
    };

    const fetchUsers = async (page = 1) => {
        try {
            const res = await axios.get(`${serverUrl}/api/admin/users?page=${page}&limit=5`, { withCredentials: true });
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchShops(), fetchDeliveries(), fetchUsers()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleStatusChange = async (userId, action) => {
        try {
            await axios.patch(`${serverUrl}/api/admin/${action}/${userId}`, {}, { withCredentials: true });
            toast.success(`User ${action}ed successfully`);
            // Refresh current views
            fetchShops(shops.page);
            fetchDeliveries(deliveries.page);
        } catch (error) {
            console.error(`Error ${action}ing user:`, error);
            toast.error(`Failed to ${action} user`);
        }
    };

    // Stats (using total data from first page fetch metadata if available, else vague)
    // Note: To get accurate total counts for stats, we might need a separate /stats endpoint or rely on the 'total' from pagination response
    const totalShopsCount = shops.total || 0;
    const totalDeliveriesCount = deliveries.total || 0;
    const totalUsersCount = users.total || 0;

    // For pending counts, we only know about the current page's pending items unless we have a specific endpoint. 
    // For MVP, let's just show pending from the current fetched batch or 0 to avoid confusion, 
    // OR we could update the backend to return stats. 
    // Let's stick to simple "Pending Actions" based on current view for now, or just remove the subtext if inactive.

    const StatsCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border-l-4" style={{ borderColor: color }}>
            <div className={`p-3 rounded-full text-white`} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );

    const PaginationControls = ({ metadata, onPageChange }) => (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-600">
                Page {metadata.page} of {metadata.totalPages}
            </span>
            <div className="flex space-x-2">
                <button
                    onClick={() => onPageChange(metadata.page - 1)}
                    disabled={metadata.page === 1}
                    className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FaChevronLeft className="text-gray-600" />
                </button>
                <button
                    onClick={() => onPageChange(metadata.page + 1)}
                    disabled={metadata.page === metadata.totalPages}
                    className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FaChevronRight className="text-gray-600" />
                </button>
            </div>
        </div>
    );

    const UserTable = ({ data, type, metadata, onPageChange }) => (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-lg">
                    {type === 'shop' ? 'Shop Owners' : type === 'delivery' ? 'Delivery Partners' : 'Regular Users'}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{metadata?.total || 0} Total</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            {type !== 'user' && (
                                <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10">
                                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-medium">{user.fullName}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">ID: {user._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{user.mobile}</p>
                                </td>
                                <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs ${user.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        user.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        <span className="relative flex items-center gap-1">
                                            {user.status === 'APPROVED' && <FaCheckCircle />}
                                            {user.status === 'REJECTED' && <FaTimesCircle />}
                                            {user.status === 'PENDING' && <FaHourglassHalf />}
                                            {user.status}
                                        </span>
                                    </span>
                                </td>
                                {type !== 'user' && (
                                    <td className="px-5 py-4 border-b border-gray-100 text-sm">
                                        <div className="flex gap-2">
                                            {user.status !== 'APPROVED' && (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'approve')}
                                                    className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-green-200"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {user.status !== 'REJECTED' && (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'reject')}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-red-200"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={type !== 'user' ? "4" : "3"} className="px-5 py-8 text-center text-gray-500 bg-white">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {metadata && onPageChange && <PaginationControls metadata={metadata} onPageChange={onPageChange} />}
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <AdminNav />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Shops"
                        value={totalShopsCount}
                        icon={<FaStore size={20} />}
                        color="#3B82F6"
                    />
                    <StatsCard
                        title="Delivery Partners"
                        value={totalDeliveriesCount}
                        icon={<FaBiking size={20} />}
                        color="#F59E0B"
                    />
                    <StatsCard
                        title="Registered Users"
                        value={totalUsersCount}
                        icon={<FaUsers size={20} />}
                        color="#10B981"
                    />
                    <StatsCard
                        title="Total Platform Users"
                        value={totalShopsCount + totalDeliveriesCount + totalUsersCount}
                        icon={<FaCheckCircle size={20} />}
                        color="#8B5CF6"
                    />
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-blue-900/5 p-1 mb-8 max-w-fit">
                    {['overview', 'shops', 'deliveries', 'users'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-32 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all outline-none
                                ${activeTab === tab
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-800'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="space-y-8">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaHourglassHalf className="text-orange-500" /> Pending Shops
                                </h2>
                                {/* Shows only the pending ones from the current page/batch, ideally we'd filter or fetch specifically pending */}
                                <UserTable
                                    data={shops.data.filter(s => s.status === 'PENDING')}
                                    type="shop"
                                    metadata={null} // No pagination for overview snippet
                                    onPageChange={null}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaHourglassHalf className="text-orange-500" /> Pending Delivery Partners
                                </h2>
                                <UserTable
                                    data={deliveries.data.filter(d => d.status === 'PENDING')}
                                    type="delivery"
                                    metadata={null}
                                    onPageChange={null}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'shops' && (
                        <UserTable
                            data={shops.data}
                            type="shop"
                            metadata={shops}
                            onPageChange={(p) => fetchShops(p)}
                        />
                    )}

                    {activeTab === 'deliveries' && (
                        <UserTable
                            data={deliveries.data}
                            type="delivery"
                            metadata={deliveries}
                            onPageChange={(p) => fetchDeliveries(p)}
                        />
                    )}

                    {activeTab === 'users' && (
                        <UserTable
                            data={users.data}
                            type="user"
                            metadata={users}
                            onPageChange={(p) => fetchUsers(p)}
                        />
                    )}
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;

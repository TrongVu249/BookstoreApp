// src/pages/customer/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All'); // All, Pending, Processing, etc.

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getMyOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'Processing': { color: 'bg-blue-100 text-blue-800', icon: '⚙️' },
            'Packed': { color: 'bg-purple-100 text-purple-800', icon: '📦' },
            'Shipped': { color: 'bg-indigo-100 text-indigo-800', icon: '🚚' },
            'Delivered': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: '❌' }
        };
        return statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFilteredOrders = () => {
        if (filter === 'All') return orders;
        return orders.filter(order => order.status === filter);
    };

    const filteredOrders = getFilteredOrders();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        📦 Order History
                    </h1>
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
                        <Link
                            to="/books"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        📦 Order History
                    </h1>
                    <p className="text-gray-600">
                        View and track all your orders
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                                {status === 'All' && ` (${orders.length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600">No orders found with status: {filter}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Left Side - Order Info */}
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                                                        {statusInfo.icon} {order.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Order Date</p>
                                                        <p className="font-semibold">{formatDate(order.orderDate)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Items</p>
                                                        <p className="font-semibold">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Total Amount</p>
                                                        <p className="font-semibold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side - Actions */}
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary Stats */}
                {orders.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                <p className="text-sm text-gray-600">Total Orders</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                    ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">Total Spent</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">
                                    {orders.filter(o => o.status === 'Delivered').length}
                                </p>
                                <p className="text-sm text-gray-600">Delivered</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {orders.filter(o => ['Pending', 'Processing', 'Packed', 'Shipped'].includes(o.status)).length}
                                </p>
                                <p className="text-sm text-gray-600">In Progress</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (statusFilter) params.status = parseInt(statusFilter);
            if (dateFrom) params.dateFrom = dateFrom;
            if (dateTo) params.dateTo = dateTo;
            if (searchTerm) params.search = searchTerm;

            const data = await adminService.getAllOrders(params);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchOrders();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setTimeout(() => fetchOrders(), 0);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': { class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'Processing': { class: 'bg-blue-100 text-blue-800', icon: '⚙️' },
            'Packed': { class: 'bg-purple-100 text-purple-800', icon: '📦' },
            'Shipped': { class: 'bg-indigo-100 text-indigo-800', icon: '🚚' },
            'Delivered': { class: 'bg-green-100 text-green-800', icon: '✓' },
            'Cancelled': { class: 'bg-red-100 text-red-800', icon: '✗' },
        };
        const statusInfo = statusMap[status] || { class: 'bg-gray-100 text-gray-800', icon: '?' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class} flex items-center gap-1 w-fit`}>
                <span>{statusInfo.icon}</span>
                {status}
            </span>
        );
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const statusMap = {
            'Completed': { class: 'bg-green-100 text-green-800', icon: '✓' },
            'Pending': { class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'Failed': { class: 'bg-red-100 text-red-800', icon: '✗' },
        };
        const statusInfo = statusMap[paymentStatus] || { class: 'bg-gray-100 text-gray-800', icon: '?' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.icon} {paymentStatus}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
                        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                        </div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Search
                            </label>
                            <input
                                type="text"
                                placeholder="Order number, user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📊 Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="0">Pending</option>
                                <option value="1">Processing</option>
                                <option value="2">Packed</option>
                                <option value="3">Shipped</option>
                                <option value="4">Delivered</option>
                                <option value="5">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📅 Date From
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📅 Date To
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🔍 Search
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Orders Count */}
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{orders.length}</span> orders
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        ❌ {error}
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <div className="text-4xl mb-2">📦</div>
                                            <p className="text-lg font-medium">No orders found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                                                    <div className="text-xs text-gray-500">ID: {order.id}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.userName}</div>
                                                    <div className="text-sm text-gray-500">{order.userEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.itemCount} items
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600 mb-1">{order.paymentMethod}</div>
                                                {getPaymentStatusBadge(order.paymentStatus)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                                <div className="text-xs">
                                                    {new Date(order.orderDate).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    👁️ View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrdersManagement;
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import staffService from '../../services/staffService';

const OrderFulfillment = () => {
    const [searchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '0'); // Default Pending
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (statusFilter) params.status = parseInt(statusFilter);

            const data = await staffService.getAllOrders(params);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await staffService.updateOrderStatus(orderId, newStatus);
            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, status: getStatusName(newStatus) }
                    : order
            ));
            alert('✅ Order status updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusName = (statusValue) => {
        const statusMap = {
            0: 'Pending',
            1: 'Processing',
            2: 'Packed',
            3: 'Shipped',
            4: 'Delivered',
            5: 'Cancelled'
        };
        return statusMap[statusValue] || 'Unknown';
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getNextStatusOptions = (currentStatus) => {
        const statusFlow = {
            'Pending': [{ value: 1, label: '⚙️ Start Processing' }],
            'Processing': [{ value: 2, label: '📦 Mark as Packed' }],
            'Packed': [{ value: 3, label: '🚚 Mark as Shipped' }],
            'Shipped': [{ value: 4, label: '✓ Mark as Delivered' }],
        };
        return statusFlow[currentStatus] || [];
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Order Fulfillment</h2>
                        <p className="text-gray-600 mt-1">Process and fulfill customer orders</p>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: '0', label: '⏳ Pending', color: 'yellow' },
                            { value: '1', label: '⚙️ Processing', color: 'blue' },
                            { value: '2', label: '📦 Packed', color: 'purple' },
                            { value: '3', label: '🚚 Shipped', color: 'indigo' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === tab.value
                                        ? `bg-${tab.color}-100 text-${tab.color}-800 border-2 border-${tab.color}-300`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <div className="text-4xl mb-2">📦</div>
                                            <p className="text-lg font-medium">No orders found</p>
                                            <p className="text-sm">Try selecting a different status</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                                                <div className="text-xs text-gray-500">ID: {order.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.userName}</div>
                                                <div className="text-sm text-gray-500">{order.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.itemCount} items
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <Link
                                                        to={`/staff/orders/${order.id}`}
                                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                                    >
                                                        👁️ View Details
                                                    </Link>
                                                    {getNextStatusOptions(order.status).map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => handleQuickStatusUpdate(order.id, option.value)}
                                                            disabled={updating === order.id}
                                                            className="text-green-600 hover:text-green-900 text-sm disabled:opacity-50 text-left"
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default OrderFulfillment;
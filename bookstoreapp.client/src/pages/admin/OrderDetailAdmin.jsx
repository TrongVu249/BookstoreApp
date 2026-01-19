import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const OrderDetailAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await adminService.getOrder(id);
            setOrder(data);
            // Map status string to enum value
            const statusMap = {
                'Pending': 0,
                'Processing': 1,
                'Packed': 2,
                'Shipped': 3,
                'Delivered': 4,
                'Cancelled': 5,
            };
            setSelectedStatus(statusMap[data.status]?.toString() || '0');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load order details');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (window.confirm('Are you sure you want to update the order status?')) {
            try {
                setUpdating(true);
                await adminService.updateOrderStatus(id, parseInt(selectedStatus));
                alert('✅ Order status updated successfully!');
                fetchOrderDetails(); // Refresh to get updated dates
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to update order status');
            } finally {
                setUpdating(false);
            }
        }
    };

    const handleCancelOrder = async () => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            try {
                setUpdating(true);
                await adminService.cancelOrder(id);
                alert('✅ Order cancelled successfully!');
                fetchOrderDetails();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to cancel order');
            } finally {
                setUpdating(false);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⏳' },
            'Processing': { class: 'bg-blue-100 text-blue-800 border-blue-300', icon: '⚙️' },
            'Packed': { class: 'bg-purple-100 text-purple-800 border-purple-300', icon: '📦' },
            'Shipped': { class: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '🚚' },
            'Delivered': { class: 'bg-green-100 text-green-800 border-green-300', icon: '✓' },
            'Cancelled': { class: 'bg-red-100 text-red-800 border-red-300', icon: '✗' },
        };
        const statusInfo = statusMap[status] || { class: 'bg-gray-100 text-gray-800 border-gray-300', icon: '?' };
        return (
            <span className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${statusInfo.class} flex items-center gap-2 w-fit`}>
                <span className="text-lg">{statusInfo.icon}</span>
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

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading order details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) return null;

    const canCancel = order.status !== 'Cancelled' && order.status !== 'Delivered';

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
                    >
                        ← Back to Orders
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Order #{order.orderNumber}</h2>
                            <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 Order Items</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                        <img
                                            src={item.bookImageUrl || 'https://via.placeholder.com/80x100?text=No+Image'}
                                            alt={item.bookTitle}
                                            className="w-20 h-28 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x100?text=No+Image';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.bookTitle}</h4>
                                            <p className="text-sm text-gray-600">{item.bookAuthor}</p>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    Qty: {item.quantity} × {formatCurrency(item.priceAtOrder)}
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(item.subtotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Amount:</span>
                                    <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">🚚 Shipping Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Address:</label>
                                    <p className="text-gray-900">{order.shippingAddress}</p>
                                </div>
                                {order.shippingPhone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Phone:</label>
                                        <p className="text-gray-900">{order.shippingPhone}</p>
                                    </div>
                                )}
                                {order.note && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Note:</label>
                                        <p className="text-gray-900">{order.note}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Information */}
                        {order.payment && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Payment Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Method:</label>
                                        <p className="text-gray-900">{order.payment.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status:</label>
                                        <p className="text-gray-900">{order.payment.status}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Amount:</label>
                                        <p className="text-gray-900 font-semibold">{formatCurrency(order.payment.amount)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Transaction ID:</label>
                                        <p className="text-gray-900 text-sm">{order.payment.transactionId}</p>
                                    </div>
                                    {order.payment.failureReason && (
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium text-red-600">Failure Reason:</label>
                                            <p className="text-red-900">{order.payment.failureReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Status & Actions */}
                    <div className="space-y-6">
                        {/* Order Timeline */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Order Timeline</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Order Date:</label>
                                    <p className="text-gray-900">
                                        {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>
                                {order.shippedDate && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Shipped Date:</label>
                                        <p className="text-gray-900">
                                            {new Date(order.shippedDate).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {order.deliveredDate && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Delivered Date:</label>
                                        <p className="text-gray-900">
                                            {new Date(order.deliveredDate).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Customer</h3>
                            <div className="space-y-2">
                                <p className="text-gray-900 font-medium">User ID: {order.userId}</p>
                            </div>
                        </div>

                        {/* Update Status */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Update Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value="0">⏳ Pending</option>
                                        <option value="1">⚙️ Processing</option>
                                        <option value="2">📦 Packed</option>
                                        <option value="3">🚚 Shipped</option>
                                        <option value="4">✓ Delivered</option>
                                        <option value="5">✗ Cancelled</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updating || order.status === 'Cancelled' || order.status === 'Delivered'}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Updating...' : '✅ Update Status'}
                                </button>
                                {canCancel && (
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={updating}
                                        className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {updating ? 'Cancelling...' : '✗ Cancel Order'}
                                    </button>
                                )}
                                <p className="text-xs text-gray-500 text-center">
                                    Dates are automatically updated when status changes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDetailAdmin;
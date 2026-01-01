// src/pages/customer/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (err) {
            setError('Failed to load order details.');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        setCancelling(true);
        try {
            await orderService.cancelOrder(id);
            alert('Order cancelled successfully!');
            // Refresh order details
            await fetchOrderDetails();
        } catch (err) {
            const errorMsg = err?.message || 'Failed to cancel order. Please try again.';
            alert(errorMsg);
            console.error('Error cancelling order:', err);
        } finally {
            setCancelling(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', step: 0 },
            'Processing': { color: 'bg-blue-100 text-blue-800', icon: '⚙️', step: 1 },
            'Packed': { color: 'bg-purple-100 text-purple-800', icon: '📦', step: 2 },
            'Shipped': { color: 'bg-indigo-100 text-indigo-800', icon: '🚚', step: 3 },
            'Delivered': { color: 'bg-green-100 text-green-800', icon: '✅', step: 4 },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: '❌', step: -1 }
        };
        return statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓', step: 0 };
    };

    const canCancelOrder = (status) => {
        return status === 'Pending' || status === 'Processing';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const OrderTimeline = ({ currentStatus }) => {
        if (currentStatus === 'Cancelled') {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">❌</div>
                    <p className="font-semibold text-red-800">Order Cancelled</p>
                </div>
            );
        }

        const steps = [
            { name: 'Pending', icon: '⏳' },
            { name: 'Processing', icon: '⚙️' },
            { name: 'Packed', icon: '📦' },
            { name: 'Shipped', icon: '🚚' },
            { name: 'Delivered', icon: '✅' }
        ];

        const currentStep = getStatusInfo(currentStatus).step;

        return (
            <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.name} className="flex flex-col items-center">
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 transition-all ${isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                                >
                                    {step.icon}
                                </div>
                                <p className={`mt-2 text-sm font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {step.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'Unable to retrieve order details.'}</p>
                        <Link
                            to="/orders"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Orders
                </button>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order Details
                            </h1>
                            <p className="text-xl text-gray-600">
                                {order.orderNumber}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${statusInfo.color}`}>
                                {statusInfo.icon} {order.status}
                            </span>
                            {canCancelOrder(order.status) && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className={`px-6 py-2 rounded-lg font-semibold transition ${cancelling
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <OrderTimeline currentStatus={order.status} />
                </div>

                {/* Order Info Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Order Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Order Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="font-semibold">{formatDate(order.orderDate)}</p>
                            </div>
                            {order.shippedDate && (
                                <div>
                                    <p className="text-sm text-gray-600">Shipped Date</p>
                                    <p className="font-semibold">{formatDate(order.shippedDate)}</p>
                                </div>
                            )}
                            {order.deliveredDate && (
                                <div>
                                    <p className="text-sm text-gray-600">Delivered Date</p>
                                    <p className="font-semibold text-green-600">{formatDate(order.deliveredDate)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="font-semibold">{order.payment?.paymentMethod || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.payment?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        order.payment?.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.payment?.status || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Transaction ID</p>
                                <p className="font-mono text-sm break-all">{order.payment?.transactionId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                            <p className="font-semibold">{order.shippingAddress}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Contact Phone</p>
                            <p className="font-semibold">{order.shippingPhone}</p>
                        </div>
                    </div>
                    {order.note && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-1">Delivery Notes</p>
                            <p className="italic text-gray-700">{order.note}</p>
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">Order Items</h2>

                    <div className="space-y-4">
                        {order.orderItems?.map((item) => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                <Link to={`/books/${item.bookId}`}>
                                    <img
                                        src={item.bookImageUrl || `https://via.placeholder.com/80x120/3b82f6/ffffff?text=${encodeURIComponent(item.bookTitle)}`}
                                        alt={item.bookTitle}
                                        className="w-16 h-24 object-cover rounded hover:opacity-80 transition"
                                    />
                                </Link>
                                <div className="flex-grow">
                                    <Link to={`/books/${item.bookId}`}>
                                        <h3 className="font-semibold text-lg hover:text-blue-600 transition">
                                            {item.bookTitle}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 mb-2">by {item.bookAuthor}</p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity} × ${item.priceAtOrder.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${item.subtotal.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Total */}
                    <div className="border-t mt-6 pt-4">
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Total Amount:</span>
                            <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
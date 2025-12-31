import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import orderService from '../../services/orderService';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Try to get order from navigation state first (faster)
        if (location.state?.orderData) {
            setOrder(location.state.orderData);
            setLoading(false);
        } else {
            // Otherwise fetch from API
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getOrderById(orderId);
            setOrder(data);
        } catch (err) {
            setError('Failed to load order details.');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            'Completed': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Failed': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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

    const getEstimatedDelivery = () => {
        if (!order?.orderDate) return 'N/A';
        const orderDate = new Date(order.orderDate);
        const estimatedDate = new Date(orderDate);
        estimatedDate.setDate(estimatedDate.getDate() + 5); // 5 days from order
        return estimatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'Unable to retrieve order details.'}</p>
                        <Link
                            to="/orders"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for your purchase. We've received your order and will process it shortly.
                    </p>

                    {/* Order Number */}
                    <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="text-2xl font-bold text-blue-600">{order.orderNumber}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Order Date</p>
                            <p className="font-semibold">{formatDate(order.orderDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Order Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                            <p className="font-semibold">{order.payment?.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.payment?.status)}`}>
                                {order.payment?.status || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                            <p className="font-mono text-sm">{order.payment?.transactionId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                            <p className="font-semibold text-green-600">{getEstimatedDelivery()}</p>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-3">Shipping Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold mb-1">Address:</p>
                            <p className="text-gray-700 mb-3">{order.shippingAddress}</p>
                            <p className="font-semibold mb-1">Phone:</p>
                            <p className="text-gray-700 mb-3">{order.shippingPhone}</p>
                            {order.note && (
                                <>
                                    <p className="font-semibold mb-1">Delivery Notes:</p>
                                    <p className="text-gray-700 italic">{order.note}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6">Order Items</h2>

                    <div className="space-y-4">
                        {order.orderItems?.map((item) => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                <img
                                    src={item.bookImageUrl || 'https://via.placeholder.com/80x120'}
                                    alt={item.bookTitle}
                                    className="w-16 h-24 object-cover rounded"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{item.bookTitle}</h3>
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to={`/orders/${order.id}`}
                        className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-semibold"
                    >
                        Track Order
                    </Link>
                    <Link
                        to="/books"
                        className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-semibold"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>📧 Order confirmation has been sent to your email.</strong>
                        <br />
                        You can track your order status anytime from your Orders page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
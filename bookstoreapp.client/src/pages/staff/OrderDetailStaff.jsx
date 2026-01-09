import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import staffService from '../../services/staffService';

const OrderDetailStaff = () => {
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
            const data = await staffService.getOrder(id);
            setOrder(data);
            const statusMap = {
                'Pending': 0, 'Processing': 1, 'Packed': 2,
                'Shipped': 3, 'Delivered': 4, 'Cancelled': 5,
            };
            setSelectedStatus(statusMap[data.status]?.toString() || '0');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load order details');
            navigate('/staff/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (window.confirm('Update order status?')) {
            try {
                setUpdating(true);
                await staffService.updateOrderStatus(id, parseInt(selectedStatus));
                alert('✅ Status updated!');
                fetchOrderDetails();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to update');
            } finally {
                setUpdating(false);
            }
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            'Pending': { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⏳' },
            'Processing': { class: 'bg-blue-100 text-blue-800 border-blue-300', icon: '⚙️' },
            'Packed': { class: 'bg-purple-100 text-purple-800 border-purple-300', icon: '📦' },
            'Shipped': { class: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '🚚' },
            'Delivered': { class: 'bg-green-100 text-green-800 border-green-300', icon: '✓' },
            'Cancelled': { class: 'bg-red-100 text-red-800 border-red-300', icon: '✗' },
        };
        const info = map[status] || { class: 'bg-gray-100 text-gray-800 border-gray-300', icon: '?' };
        return (
            <span className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${info.class} flex items-center gap-2 w-fit`}>
                <span className="text-lg">{info.icon}</span>
                {status}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    if (!order) return null;

    return (
        <StaffLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="mb-6">
                    <button onClick={() => navigate('/staff/orders')} className="text-blue-600 hover:text-blue-800 mb-2">
                        ← Back to Orders
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Order #{order.orderNumber}</h2>
                            <p className="text-gray-600 mt-1">ID: {order.id}</p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 Order Items</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                                        <img src={item.bookImageUrl || 'https://via.placeholder.com/80x100'} alt={item.bookTitle} className="w-20 h-28 object-cover rounded" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.bookTitle}</h4>
                                            <p className="text-sm text-gray-600">{item.bookAuthor}</p>
                                            <div className="mt-2 flex justify-between">
                                                <span className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.priceAtOrder)}</span>
                                                <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">🚚 Shipping</h3>
                            <div className="space-y-3">
                                <div><label className="text-sm font-medium text-gray-600">Address:</label><p>{order.shippingAddress}</p></div>
                                {order.shippingPhone && <div><label className="text-sm font-medium text-gray-600">Phone:</label><p>{order.shippingPhone}</p></div>}
                                {order.note && <div><label className="text-sm font-medium text-gray-600">Note:</label><p>{order.note}</p></div>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Timeline</h3>
                            <div className="space-y-3">
                                <div><label className="text-sm font-medium text-gray-600">Ordered:</label><p>{new Date(order.orderDate).toLocaleString()}</p></div>
                                {order.shippedDate && <div><label className="text-sm font-medium text-gray-600">Shipped:</label><p>{new Date(order.shippedDate).toLocaleString()}</p></div>}
                                {order.deliveredDate && <div><label className="text-sm font-medium text-gray-600">Delivered:</label><p>{new Date(order.deliveredDate).toLocaleString()}</p></div>}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Update Status</h3>
                            <div className="space-y-4">
                                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} disabled={order.status === 'Cancelled' || order.status === 'Delivered'} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                                    <option value="0">⏳ Pending</option>
                                    <option value="1">⚙️ Processing</option>
                                    <option value="2">📦 Packed</option>
                                    <option value="3">🚚 Shipped</option>
                                    <option value="4">✓ Delivered</option>
                                </select>
                                <button onClick={handleStatusUpdate} disabled={updating || order.status === 'Cancelled' || order.status === 'Delivered'} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400">
                                    {updating ? 'Updating...' : '✅ Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default OrderDetailStaff;
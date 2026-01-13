import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import staffService from '../../services/staffService';
import inventoryService from '../../services/inventoryService';

const StaffDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [lowStockBooks, setLowStockBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, logsData, lowStockData] = await Promise.all([
                staffService.getDashboardStats(),
                inventoryService.getInventoryLogs(),
                inventoryService.getLowStockBooks(10)
            ]);

            setStats(statsData);
            setRecentLogs(logsData.slice(0, 5)); // Last 5 logs
            setLowStockBooks(lowStockData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    if (error) {
        return (
            <StaffLayout>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-medium">❌ {error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Staff Dashboard! 👔</h2>
                    <p className="text-blue-100">Manage orders and inventory efficiently</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/staff/orders?status=0"
                        className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-4xl">⏳</span>
                            <div className="text-right">
                                <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrdersCount}</p>
                            </div>
                        </div>
                        <p className="text-sm text-yellow-700">Orders awaiting processing</p>
                    </Link>

                    <Link
                        to="/staff/orders?status=1"
                        className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-4xl">⚙️</span>
                            <div className="text-right">
                                <p className="text-sm font-medium text-blue-800">Processing Orders</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.processingOrdersCount}</p>
                            </div>
                        </div>
                        <p className="text-sm text-blue-700">Orders being fulfilled</p>
                    </Link>

                    <Link
                        to="/staff/inventory"
                        className="bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-4xl">⚠️</span>
                            <div className="text-right">
                                <p className="text-sm font-medium text-red-800">Low Stock Items</p>
                                <p className="text-3xl font-bold text-red-600">{stats.lowStockBooksCount}</p>
                            </div>
                        </div>
                        <p className="text-sm text-red-700">Books need restocking</p>
                    </Link>
                </div>

                {/* Low Stock Alert */}
                {lowStockBooks.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">⚠️ Low Stock Alert</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {lowStockBooks.slice(0, 5).map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{book.title}</div>
                                                <div className="text-sm text-gray-500">{book.author}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`font-bold ${book.stockQuantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                                    {book.stockQuantity} units
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{book.status}</td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    to={`/staff/inventory?bookId=${book.id}`}
                                                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                >
                                                    Update Stock →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {lowStockBooks.length > 5 && (
                            <div className="mt-4 text-center">
                                <Link
                                    to="/staff/inventory"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View All Low Stock Items →
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Inventory Changes */}
                {recentLogs.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Recent Inventory Changes</h3>
                        <div className="space-y-3">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className={`text-2xl ${log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {log.quantityChange > 0 ? '📈' : '📉'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            {log.bookTitle}
                                            <span className={`ml-2 font-bold ${log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">{log.reason}</div>
                                        {log.notes && (
                                            <div className="text-xs text-gray-500 italic">{log.notes}</div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {log.userName} • {new Date(log.loggedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Stock: <span className="font-semibold">{log.quantityAfter}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Link
                            to="/staff/orders"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">📦</span>
                            <span className="text-sm font-medium">View All Orders</span>
                        </Link>
                        <Link
                            to="/staff/inventory"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">📋</span>
                            <span className="text-sm font-medium">Manage Inventory</span>
                        </Link>
                        <button
                            onClick={fetchDashboardData}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">🔄</span>
                            <span className="text-sm font-medium">Refresh Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default StaffDashboard;
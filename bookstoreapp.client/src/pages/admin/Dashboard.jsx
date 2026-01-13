import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const Dashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getStatistics();
            setStatistics(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load statistics');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
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
                        <p className="mt-4 text-gray-600">Loading statistics...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-medium">❌ {error}</p>
                    <button
                        onClick={fetchStatistics}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        // User Statistics
        {
            title: 'Total Users',
            value: statistics.totalUsers,
            icon: '👥',
            color: 'blue',
            subtitle: `${statistics.totalCustomers} customers`,
        },
        {
            title: 'Staff Members',
            value: statistics.totalStaff,
            icon: '👔',
            color: 'purple',
            subtitle: `${statistics.totalAdmins} admins`,
        },

        // Book Statistics
        {
            title: 'Total Books',
            value: statistics.totalBooks,
            icon: '📚',
            color: 'green',
            subtitle: `${statistics.availableBooks} available`,
        },
        {
            title: 'Out of Stock',
            value: statistics.outOfStockBooks,
            icon: '📦',
            color: 'orange',
            subtitle: 'Books unavailable',
        },

        // Order Statistics
        {
            title: 'Total Orders',
            value: statistics.totalOrders,
            icon: '🛒',
            color: 'indigo',
            subtitle: 'All time',
        },
        {
            title: 'Average Order',
            value: formatCurrency(statistics.averageOrderValue),
            icon: '💰',
            color: 'yellow',
            subtitle: 'Per order',
        },

        // Revenue Statistics
        {
            title: 'Total Revenue',
            value: formatCurrency(statistics.totalRevenue),
            icon: '💵',
            color: 'green',
            subtitle: 'All time',
        },
        {
            title: 'Revenue (Month)',
            value: formatCurrency(statistics.revenueThisMonth),
            icon: '📈',
            color: 'blue',
            subtitle: 'This month',
        },
        {
            title: 'Revenue (Today)',
            value: formatCurrency(statistics.revenueToday),
            icon: '📊',
            color: 'teal',
            subtitle: 'Today',
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        purple: 'bg-purple-50 border-purple-200 text-purple-600',
        green: 'bg-green-50 border-green-200 text-green-600',
        orange: 'bg-orange-50 border-orange-200 text-orange-600',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
        teal: 'bg-teal-50 border-teal-200 text-teal-600',
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard! 👋</h2>
                    <p className="text-blue-100">Here's an overview of your bookstore's performance</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className={`${colorClasses[card.color]} border-2 rounded-lg p-6 transition-all hover:shadow-lg hover:scale-105`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{card.icon}</span>
                                <div className="text-right">
                                    <p className="text-sm font-medium opacity-75">{card.title}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                            </div>
                            <p className="text-sm opacity-75">{card.subtitle}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            to="/admin/users"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">👥</span>
                            <span className="text-sm font-medium">Manage Users</span>
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">📦</span>
                            <span className="text-sm font-medium">Manage Orders</span>
                        </Link>
                        <Link
                            to="/admin/books"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">📚</span>
                            <span className="text-sm font-medium">Manage Books</span>
                        </Link>
                        <Link
                            to="/admin/inventory"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">📋</span>
                            <span className="text-sm font-medium">Inventory Management</span>
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="text-2xl block mb-2">🏷️</span>
                            <span className="text-sm font-medium">Manage Categories</span>
                        </Link>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="text-center">
                    <button
                        onClick={fetchStatistics}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        🔄 Refresh Statistics
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
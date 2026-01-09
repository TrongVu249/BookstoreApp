import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StaffLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/staff/dashboard',
            icon: '📊',
        },
        {
            name: 'Order Fulfillment',
            path: '/staff/orders',
            icon: '📦',
        },
        {
            name: 'Inventory Management',
            path: '/staff/inventory',
            icon: '📋',
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
            >
                {/* Logo/Brand */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen ? (
                            <h1 className="text-xl font-bold text-blue-600">Staff Panel</h1>
                        ) : (
                            <span className="text-2xl">👔</span>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="ml-3">{item.name}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200">
                    {sidebarOpen ? (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                                <div className="font-medium text-gray-900">{user?.fullName}</div>
                                <div className="text-xs">{user?.email}</div>
                                <div className="text-xs text-blue-600 font-medium">{user?.role}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Logout"
                        >
                            🚪
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <header className="bg-white shadow-sm">
                    <div className="px-8 py-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {menuItems.find((item) => item.path === location.pathname)?.name || 'Staff Panel'}
                        </h2>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StaffLayout;
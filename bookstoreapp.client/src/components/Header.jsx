import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
    const profileRef = useRef(null);
    const categoriesRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
            if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
                setCategoriesDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate('/login');
    };

    // Sample categories
    const categories = [
        'Fiction', 'Non-Fiction', 'Science', 'History',
        'Biography', 'Technology', 'Business', 'Self-Help'
    ];

    // Profile dropdown menu items based on role
    const getProfileMenuItems = () => {
        if (!user) return [];

        const commonItems = [
            { name: 'My Profile', path: '/profile', icon: '👤' }
        ];

        switch (user.role) {
            case 'Admin':
                return [
                    ...commonItems,
                    { divider: true },
                    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
                    { name: 'Manage Users', path: '/admin/users', icon: '👥' },
                    { name: 'Manage Orders', path: '/admin/orders', icon: '📦' },
                    { name: 'Manage Books', path: '/admin/books', icon: '📚' },
                    { name: 'Manage Categories', path: '/admin/categories', icon: '🏷️' },
                ];
            case 'Staff':
                return [
                    ...commonItems,
                    { divider: true },
                    { name: 'Dashboard', path: '/staff/dashboard', icon: '📊' },
                    { name: 'Order Fulfillment', path: '/staff/orders', icon: '📦' },
                    { name: 'Inventory Management', path: '/staff/inventory', icon: '📋' },
                ];
            case 'Customer':
            default:
                return [
                    ...commonItems,
                    { name: 'Order History', path: '/orders', icon: '📦' },
                ];
        }
    };

    const profileMenuItems = getProfileMenuItems();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">📚</span>
                        <span className="text-xl font-bold text-gray-900">Bookstore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Home */}
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            Home
                        </Link>

                        {/* Categories Dropdown */}
                        <div className="relative" ref={categoriesRef}>
                            <button
                                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                                className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center"
                            >
                                Categories
                                <svg
                                    className={`ml-1 w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {categoriesDropdownOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                                    {categories.map((category) => (
                                        <Link
                                            key={category}
                                            to={`/books?category=${category}`}
                                            onClick={() => setCategoriesDropdownOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customer-only: Cart & Wishlist */}
                        {isAuthenticated && user?.role === 'Customer' && (
                            <>
                                <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center">
                                    🛒 Cart
                                </Link>
                                <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center">
                                    ❤️ Wishlist
                                </Link>
                                <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                    Orders
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side: Profile or Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {(user?.fullName || user?.userName)?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{user?.fullName || user?.userName}</p>
                                        <p className="text-xs text-gray-500">{user?.role}</p>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border">
                                        {profileMenuItems.map((item, index) =>
                                            item.divider ? (
                                                <div key={index} className="border-t my-2"></div>
                                            ) : (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                                >
                                                    <span className="mr-3">{item.icon}</span>
                                                    {item.name}
                                                </Link>
                                            )
                                        )}
                                        <div className="border-t my-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                        >
                                            <span className="mr-3">🚪</span>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-3">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                Home
                            </Link>

                            {/* Categories in Mobile */}
                            <div className="px-2 py-1">
                                <p className="font-medium text-gray-900 mb-2">Categories</p>
                                <div className="pl-4 space-y-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category}
                                            to={`/books?category=${category}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-gray-600 hover:text-blue-600"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {isAuthenticated && user?.role === 'Customer' && (
                                <>
                                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                        🛒 Cart
                                    </Link>
                                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                        ❤️ Wishlist
                                    </Link>
                                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1">
                                        Orders
                                    </Link>
                                </>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <div className="border-t pt-3 mt-2">
                                        <p className="font-medium text-gray-900 px-2 mb-2">Profile Menu</p>
                                        <div className="space-y-2">
                                            {profileMenuItems.map((item, index) =>
                                                item.divider ? null : (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex items-center text-gray-700 hover:text-blue-600 px-2 py-1"
                                                    >
                                                        <span className="mr-2">{item.icon}</span>
                                                        {item.name}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-red-600 hover:text-red-700 font-medium px-2 py-1 mt-2"
                                    >
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 hover:text-blue-700 font-medium px-2 py-1">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 hover:text-blue-700 font-medium px-2 py-1">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
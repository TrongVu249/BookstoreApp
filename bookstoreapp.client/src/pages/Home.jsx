import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            // Fetch books and categories in parallel
            const [booksData, categoriesData] = await Promise.all([
                bookService.getBooks(),
                bookService.getCategories()
            ]);

            // Get first 6 available books as featured
            const availableBooks = booksData.filter(book => book.status === 0 || book.status === 'Available');
            setFeaturedBooks(availableBooks.slice(0, 6));

            // Get active categories
            const activeCategories = categoriesData.filter(cat => cat.isActive);
            setCategories(activeCategories.slice(0, 8)); // First 8 categories
        } catch (err) {
            console.error('Error fetching home data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'General';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome to Our Online Bookstore
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        Discover thousands of books across all genres
                    </p>

                    {isAuthenticated ? (
                        <div className="space-x-4">
                            <Link
                                to="/books"
                                className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                            >
                                Browse All Books
                            </Link>
                            {user?.role === 'Customer' && (
                                <Link
                                    to="/orders"
                                    className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
                                >
                                    My Orders
                                </Link>
                            )}
                            {user?.role === 'Admin' && (
                                <Link
                                    to="/admin/dashboard"
                                    className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            {user?.role === 'Staff' && (
                                <Link
                                    to="/staff/dashboard"
                                    className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
                                >
                                    Staff Dashboard
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                to="/register"
                                className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* User Welcome Section (if logged in) */}
            {isAuthenticated && (
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            👋 Welcome back, {user?.fullName || user?.userName}!
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Username</p>
                                <p className="font-semibold">{user?.userName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email</p>
                                <p className="font-semibold">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Role</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Books Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            📚 Featured Books
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Handpicked selections just for you
                        </p>
                    </div>
                    <Link
                        to="/books"
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                        View All
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading books...</p>
                        </div>
                    </div>
                ) : featuredBooks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-lg font-medium text-gray-900">No books available yet</p>
                        <p className="text-sm text-gray-500">Check back soon for new arrivals!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={book.imageUrl || `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`}
                                        alt={book.title}
                                        className="w-full h-64 object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`;
                                        }}
                                    />
                                    <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                        {getCategoryName(book.categoryId)}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        by {book.author}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatCurrency(book.price)}
                                        </span>
                                        {isAuthenticated ? (
                                            <Link
                                                to={`/books/${book.id}`}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                            >
                                                Login to Buy
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    Why Choose Us?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                        <div className="text-5xl mb-4">📖</div>
                        <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
                        <p className="text-gray-600">
                            Browse thousands of books from various genres including fiction,
                            non-fiction, educational, and more.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                        <div className="text-5xl mb-4">🚚</div>
                        <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                        <p className="text-gray-600">
                            Get your books delivered quickly to your doorstep with
                            our reliable shipping partners.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                        <div className="text-5xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                        <p className="text-gray-600">
                            Enjoy competitive prices and regular discounts on your
                            favorite books and authors.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action (for guests) */}
            {!isAuthenticated && (
                <div className="bg-blue-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <h3 className="text-2xl font-semibold mb-3">New Customer?</h3>
                                <p className="text-gray-600 mb-6">
                                    Create an account to start shopping for books,
                                    manage your orders, and enjoy personalized recommendations.
                                </p>
                                <Link
                                    to="/register"
                                    className="block w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold transition"
                                >
                                    Create Account
                                </Link>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-8">
                                <h3 className="text-2xl font-semibold mb-3">Already a Member?</h3>
                                <p className="text-gray-600 mb-6">
                                    Sign in to access your account, view your order history,
                                    and continue where you left off.
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-center font-semibold transition"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popular Categories */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    Popular Categories
                </h2>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-center text-gray-500">No categories available</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/books?category=${category.id}`}
                                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer"
                            >
                                <p className="font-semibold text-gray-900">{category.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
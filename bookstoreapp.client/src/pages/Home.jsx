import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    // Mock featured books 
    const featuredBooks = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            imageUrl: "https://via.placeholder.com/200x300/3b82f6/ffffff?text=The+Great+Gatsby",
            category: "Fiction"
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 14.99,
            imageUrl: "https://via.placeholder.com/200x300/8b5cf6/ffffff?text=To+Kill+a+Mockingbird",
            category: "Fiction"
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            price: 13.99,
            imageUrl: "https://via.placeholder.com/200x300/ec4899/ffffff?text=1984",
            category: "Fiction"
        },
        {
            id: 4,
            title: "Sapiens",
            author: "Yuval Noah Harari",
            price: 18.99,
            imageUrl: "https://via.placeholder.com/200x300/10b981/ffffff?text=Sapiens",
            category: "Non-Fiction"
        },
        {
            id: 5,
            title: "Atomic Habits",
            author: "James Clear",
            price: 16.99,
            imageUrl: "https://via.placeholder.com/200x300/f59e0b/ffffff?text=Atomic+Habits",
            category: "Self-Help"
        },
        {
            id: 6,
            title: "The Lean Startup",
            author: "Eric Ries",
            price: 15.99,
            imageUrl: "https://via.placeholder.com/200x300/ef4444/ffffff?text=The+Lean+Startup",
            category: "Business"
        }
    ];

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
                            <Link
                                to="/orders"
                                className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
                            >
                                My Orders
                            </Link>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredBooks.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-full h-64 object-cover"
                                />
                                <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                    {book.category}
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
                                        ${book.price}
                                    </span>
                                    {isAuthenticated ? (
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                            View Details
                                        </button>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Business', 'Self-Help'].map((category) => (
                        <Link
                            key={category}
                            to={`/books?category=${category}`}
                            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer"
                        >
                            <p className="font-semibold text-gray-900">{category}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
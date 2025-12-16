import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            📚 Bookstore
                        </h1>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-gray-700">
                                        Welcome, <span className="font-medium">{user?.fullName || user?.userName}</span>
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {user?.role}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Our Online Bookstore
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Discover thousands of books across all genres
                    </p>

                    {isAuthenticated ? (
                        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-semibold mb-4">
                                🎉 You're logged in!
                            </h3>
                            <div className="text-left space-y-2 mb-6">
                                <p><strong>Username:</strong> {user?.userName}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Role:</strong> {user?.role}</p>
                                <p><strong>Full Name:</strong> {user?.fullName || 'Not provided'}</p>
                            </div>
                            <p className="text-gray-600">
                                Book catalog and other features coming soon in Week 2!
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-3">New Customer?</h3>
                                <p className="text-gray-600 mb-4">
                                    Create an account to start shopping for books
                                </p>
                                <Link
                                    to="/register"
                                    className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition"
                                >
                                    Create Account
                                </Link>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-3">Already a Member?</h3>
                                <p className="text-gray-600 mb-4">
                                    Sign in to access your account and orders
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-center transition"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-3">📖</div>
                        <h4 className="text-lg font-semibold mb-2">Wide Selection</h4>
                        <p className="text-gray-600">
                            Browse thousands of books from various genres
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-3">🚚</div>
                        <h4 className="text-lg font-semibold mb-2">Fast Delivery</h4>
                        <p className="text-gray-600">
                            Get your books delivered quickly to your doorstep
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-3">💰</div>
                        <h4 className="text-lg font-semibold mb-2">Best Prices</h4>
                        <p className="text-gray-600">
                            Competitive prices and regular discounts
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-600">
                        © 2024 Bookstore. Graduation Project by [Your Name]
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
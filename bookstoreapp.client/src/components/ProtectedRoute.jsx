import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role - show denied access
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Access Denied
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>

                    {/* User Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-sm text-gray-600 mb-1">Your current role:</div>
                        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                            {user?.role}
                        </div>
                    </div>

                    {/* Required Roles */}
                    {allowedRoles && allowedRoles.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Required role(s):</strong>
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {allowedRoles.map((role) => (
                                    <span
                                        key={role}
                                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // User is authenticated and has correct role
    return children;
};

export default ProtectedRoute;
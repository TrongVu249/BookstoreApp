import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages (no layout)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public/Common Pages
import Home from './pages/Home';

// Customer Pages
import Books from './pages/customer/Books';
import BookDetail from './pages/customer/BookDetail';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';

///Redundant, constrained max width
///import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth Routes - No Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* All Other Routes - With Layout */}
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    {/* Public Home */}
                                    <Route path="/" element={<Home />} />

                                    {/* Books - All authenticated users can view */}
                                    <Route
                                        path="/books"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer', 'Staff', 'Admin']}>
                                                <Books />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/books/:id"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer', 'Staff', 'Admin']}>
                                                <BookDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Profile - All authenticated users */}
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer', 'Staff', 'Admin']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">👤 My Profile</h1>
                                                    <p className="text-gray-600">Coming in Day 21!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Customer Routes */}
                                    <Route
                                        path="/cart"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <Cart />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/wishlist"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <Wishlist />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📦 Order History</h1>
                                                    <p className="text-gray-600">Coming in Day 12!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/checkout"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">💳 Checkout</h1>
                                                    <p className="text-gray-600">Coming in Day 11!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Staff Routes */}
                                    <Route
                                        path="/staff/orders"
                                        element={
                                            <ProtectedRoute allowedRoles={['Staff']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📦 Manage Orders</h1>
                                                    <p className="text-gray-600">Coming in Day 18!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/staff/inventory"
                                        element={
                                            <ProtectedRoute allowedRoles={['Staff']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📋 Update Inventory</h1>
                                                    <p className="text-gray-600">Coming in Day 18!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Admin Routes */}
                                    <Route
                                        path="/admin/dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['Admin']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📊 Admin Dashboard</h1>
                                                    <p className="text-gray-600">Coming in Day 14!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/books"
                                        element={
                                            <ProtectedRoute allowedRoles={['Admin']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📚 Manage Books</h1>
                                                    <p className="text-gray-600">Coming in Day 15!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/users"
                                        element={
                                            <ProtectedRoute allowedRoles={['Admin']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">👥 Manage Users</h1>
                                                    <p className="text-gray-600">Coming in Day 16!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/orders"
                                        element={
                                            <ProtectedRoute allowedRoles={['Admin']}>
                                                <div className="container mx-auto px-4 py-8">
                                                    <h1 className="text-3xl font-bold mb-4">📦 Manage Orders</h1>
                                                    <p className="text-gray-600">Coming in Day 17!</p>
                                                </div>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* 404 */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Layout>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
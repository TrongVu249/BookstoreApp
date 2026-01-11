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
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import OrderHistory from './pages/customer/OrderHistory';
import OrderDetail from './pages/customer/OrderDetail';

// Common Pages (Profile)
import Profile from './pages/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import BooksManagement from './pages/admin/BooksManagement';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';
import UsersManagement from './pages/admin/UsersManagement';
import AddUser from './pages/admin/AddUser';
import EditUser from './pages/admin/EditUser';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import AddCategory from './pages/admin/AddCategory';
import EditCategory from './pages/admin/EditCategory';
import OrdersManagement from './pages/admin/OrdersManagement';
import OrderDetailAdmin from './pages/admin/OrderDetailAdmin';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import OrderFulfillment from './pages/staff/OrderFulfillment';
import InventoryManagement from './pages/staff/InventoryManagement';
import OrderDetailStaff from './pages/staff/OrderDetailStaff';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth Routes - No Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes - No Layout */}
                    {/* Admin Dashboard */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Books Management */}
                    <Route
                        path="/admin/books"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <BooksManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/books/add"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <AddBook />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/books/edit/:id"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <EditBook />
                            </ProtectedRoute>
                        }
                    />

                    {/* Users Management */}
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <UsersManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/add"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <AddUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/edit/:id"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <EditUser />
                            </ProtectedRoute>
                        }
                    />

                    {/* Categories Management */}
                    <Route
                        path="/admin/categories"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <CategoriesManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/categories/add"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <AddCategory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/categories/edit/:id"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <EditCategory />
                            </ProtectedRoute>
                        }
                    />

                    {/* Orders Management */}
                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <OrdersManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/orders/:id"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <OrderDetailAdmin />
                            </ProtectedRoute>
                        }
                    />

                    {/* Staff Routes below - No Layout */}
                    {/* Staff Dashboard */}
                    <Route
                        path="/staff/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['Staff']}>
                                <StaffDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Order Fulfillment */}
                    <Route
                        path="/staff/orders"
                        element={
                            <ProtectedRoute allowedRoles={['Staff']}>
                                <OrderFulfillment />
                            </ProtectedRoute>
                        }
                    />

                    {/* Order Detail for Staff */}
                    <Route
                        path="/staff/orderdetail"
                        element={
                            <ProtectedRoute allowedRoles={['Staff']}>
                                <OrderDetailStaff />
                            </ProtectedRoute>
                        }
                    />

                    {/* Staff Inventory Management */ }
                    <Route
                        path="/staff/inventory"
                        element={
                            <ProtectedRoute allowedRoles={['Staff']}>
                                <InventoryManagement />
                            </ProtectedRoute>
                        }
                    />

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
                                                <Profile />
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
                                        path="/checkout"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <Checkout />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/order-confirmation/:orderId"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <OrderConfirmation />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <OrderHistory />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders/:id"
                                        element={
                                            <ProtectedRoute allowedRoles={['Customer']}>
                                                <OrderDetail />
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
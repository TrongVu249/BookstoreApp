import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItems, setUpdatingItems] = useState(new Set());

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await cartService.getCart();
            setCartItems(data.items ?? []);
        } catch (err) {
            setError('Failed to load cart. Please try again.');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (bookId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(bookId));
        try {
            await cartService.updateCartItem(bookId, newQuantity);

            // Update local state
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.bookId === bookId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            alert('Failed to update quantity. Please try again.');
            console.error('Error updating cart item:', err);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (bookId) => {
        if (!confirm('Remove this item from cart?')) return;

        try {
            await cartService.removeFromCart(bookId);
            setCartItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
        } catch (err) {
            alert('Failed to remove item. Please try again.');
            console.error('Error removing cart item:', err);
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Clear all items from cart?')) return;

        try {
            await cartService.clearCart();
            setCartItems([]);
        } catch (err) {
            alert('Failed to clear cart. Please try again.');
            console.error('Error clearing cart:', err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = item.bookPrice || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding books to your cart!</p>
                        <Link
                            to="/books"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            🛒 Shopping Cart
                        </h1>
                        <p className="text-gray-600">
                            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
                        </p>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                                >
                                    {/* Book Image */}
                                    <Link to={`/books/${item.bookId}`} className="flex-shrink-0">
                                        <img
                                            src={item.bookImageUrl || `https://via.placeholder.com/120x180/3b82f6/ffffff?text=${encodeURIComponent(item.bookTitle || 'Book')}`}
                                            alt={item.bookTitle}
                                            className="w-24 h-36 object-cover rounded"
                                        />
                                    </Link>

                                    {/* Book Details */}
                                    <div className="flex-grow">
                                        <Link
                                            to={`/books/${item.bookId}`}
                                            className="text-lg font-bold text-gray-900 hover:text-blue-600 transition"
                                        >
                                            {item.bookTitle || 'Unknown Title'}
                                        </Link>
                                        <p className="text-sm text-gray-600 mt-1">
                                            by {item.bookAuthor || 'Unknown Author'}
                                        </p>
                                        <p className="text-lg font-semibold text-blue-600 mt-2">
                                            ${(item.bookPrice || 0).toFixed(2)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingItems.has(item.bookId)}
                                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 bg-gray-100 rounded font-semibold min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                                                    disabled={updatingItems.has(item.bookId)}
                                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.bookId)}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Subtotal</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ${((item.bookPrice || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items ({getTotalItems()})</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/books"
                                className="block w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-semibold"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
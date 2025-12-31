import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';

const Checkout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        shippingAddress: '',
        shippingPhone: '',
        note: '',
        paymentMethod: 'CashOnDelivery'
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await cartService.getCart();
            if (!data || data.length === 0) {
                navigate('/cart');
                return;
            }
            setCartItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load cart. Please try again.');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = item.book?.price || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.shippingAddress.trim()) {
            errors.shippingAddress = 'Shipping address is required';
        } else if (formData.shippingAddress.length < 10) {
            errors.shippingAddress = 'Please enter a complete address';
        }

        if (!formData.shippingPhone.trim()) {
            errors.shippingPhone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.shippingPhone.replace(/\D/g, ''))) {
            errors.shippingPhone = 'Please enter a valid phone number';
        }

        if (!formData.paymentMethod) {
            errors.paymentMethod = 'Please select a payment method';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const orderData = {
                shippingAddress: formData.shippingAddress.trim(),
                shippingPhone: formData.shippingPhone.trim(),
                note: formData.note.trim(),
                paymentMethod: formData.paymentMethod
            };

            const response = await orderService.createOrder(orderData);

            // Navigate to order confirmation page
            navigate(`/order-confirmation/${response.id}`, {
                state: { orderData: response }
            });
        } catch (err) {
            const errorMsg = err?.message || err || 'Failed to place order. Please try again.';
            setError(errorMsg);
            console.error('Error creating order:', err);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading checkout...</p>
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
                        <p className="text-gray-600 mb-6">Add some books before checking out</p>
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        💳 Checkout
                    </h1>
                    <p className="text-gray-600">
                        Complete your order
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Side - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                            Shipping Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="shippingAddress"
                                            name="shippingAddress"
                                            rows="3"
                                            value={formData.shippingAddress}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="123 Main St, Apt 4B, New York, NY 10001"
                                        />
                                        {formErrors.shippingAddress && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.shippingAddress}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="shippingPhone"
                                            name="shippingPhone"
                                            value={formData.shippingPhone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="0123456789"
                                        />
                                        {formErrors.shippingPhone && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.shippingPhone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Notes (Optional)
                                        </label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            rows="2"
                                            value={formData.note}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Leave at front desk if not home"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CashOnDelivery"
                                            checked={formData.paymentMethod === 'CashOnDelivery'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold">Cash on Delivery</p>
                                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CreditCard"
                                            checked={formData.paymentMethod === 'CreditCard'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold">Credit Card</p>
                                            <p className="text-sm text-gray-600">Pay securely with your credit card</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="PayPal"
                                            checked={formData.paymentMethod === 'PayPal'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold">PayPal</p>
                                            <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.book?.imageUrl || 'https://via.placeholder.com/60x90'}
                                                alt={item.book?.title}
                                                className="w-12 h-18 object-cover rounded"
                                            />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm line-clamp-2">
                                                    {item.book?.title}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Qty: {item.quantity} × ${(item.book?.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-sm">
                                                ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({getTotalItems()} items)</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">FREE</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${submitting
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>

                                <Link
                                    to="/cart"
                                    className="block w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
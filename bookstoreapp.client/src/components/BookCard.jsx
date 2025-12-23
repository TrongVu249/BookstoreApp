import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import wishlistService from '../services/wishlistService';

const BookCard = ({ book }) => {
    const { isAuthenticated, user } = useAuth();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || user?.role !== 'Customer') return;

        setIsAddingToCart(true);
        try {
            await cartService.addToCart(book.id, 1);
            alert(`"${book.title}" added to cart!`);
        } catch (err) {
            const errorMsg = err?.message || err || 'Failed to add to cart';
            alert(errorMsg);
            console.error('Error adding to cart:', err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated || user?.role !== 'Customer') return;

        setIsAddingToWishlist(true);
        try {
            await wishlistService.addToWishlist(book.id);
            alert(`"${book.title}" added to wishlist!`);
        } catch (err) {
            const errorMsg = err?.message || err || 'Failed to add to wishlist';
            alert(errorMsg);
            console.error('Error adding to wishlist:', err);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    // Stock status badge
    const getStockBadge = () => {
        if (book.stockQuantity === 0) {
            return <span className="absolute top-2 left-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">Out of Stock</span>;
        } else if (book.stockQuantity < 5) {
            return <span className="absolute top-2 left-2 px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">Low Stock</span>;
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <Link to={`/books/${book.id}`} className="relative">
                <img
                    src={book.imageUrl || `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(book.title)}`}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                />
                {getStockBadge()}
                {book.categoryName && (
                    <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {book.categoryName}
                    </span>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/books/${book.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                {book.isbn && (
                    <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>
                )}

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                            ${book.price.toFixed(2)}
                        </span>
                        {isAuthenticated && user?.role === 'Customer' && (
                            <button
                                onClick={handleAddToWishlist}
                                disabled={isAddingToWishlist}
                                className={`p-2 transition ${isAddingToWishlist
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-red-500'
                                    }`}
                                title="Add to Wishlist"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {isAuthenticated && user?.role === 'Customer' ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={book.stockQuantity === 0 || isAddingToCart}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${book.stockQuantity === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : isAddingToCart
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isAddingToCart
                                    ? 'Adding...'
                                    : book.stockQuantity === 0
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                            </button>
                            <Link
                                to={`/books/${book.id}`}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-center"
                            >
                                Details
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to={isAuthenticated ? `/books/${book.id}` : '/login'}
                            className="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-medium"
                        >
                            {isAuthenticated ? 'View Details' : 'Login to Purchase'}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
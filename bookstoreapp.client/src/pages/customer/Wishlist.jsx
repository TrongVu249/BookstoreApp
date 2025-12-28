import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';
import cartService from '../../services/cartService';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingItems, setProcessingItems] = useState(new Set());

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await wishlistService.getWishlist();
            setWishlistItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load wishlist. Please try again.');
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (bookId) => {
        if (!confirm('Remove this book from wishlist?')) return;

        try {
            await wishlistService.removeFromWishlist(bookId);
            setWishlistItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
        } catch (err) {
            alert('Failed to remove from wishlist. Please try again.');
            console.error('Error removing from wishlist:', err);
        }
    };

    const handleAddToCart = async (bookId, bookTitle) => {
        setProcessingItems(prev => new Set(prev).add(bookId));
        try {
            await cartService.addToCart(bookId, 1);
            alert(`"${bookTitle}" added to cart!`);
        } catch (err) {
            alert('Failed to add to cart. Please try again.');
            console.error('Error adding to cart:', err);
        } finally {
            setProcessingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookId);
                return newSet;
            });
        }
    };

    const handleClearWishlist = async () => {
        if (!confirm('Clear your entire wishlist?')) return;

        try {
            await wishlistService.clearWishlist();
            setWishlistItems([]);
        } catch (err) {
            alert('Failed to clear wishlist. Please try again.');
            console.error('Error clearing wishlist:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Save books you love for later!</p>
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
                            ❤️ My Wishlist
                        </h1>
                        <p className="text-gray-600">
                            {wishlistItems.length} book{wishlistItems.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    {wishlistItems.length > 0 && (
                        <button
                            onClick={handleClearWishlist}
                            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition"
                        >
                            Clear Wishlist
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            <Link to={`/books/${item.bookId}`} className="relative">
                                <img
                                    src={item.bookImageUrl || `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(item.bookTitle || 'Book')}`}
                                    alt={item.bookTitle}
                                    className="w-full h-64 object-cover"
                                />
                                {item.book?.categoryName && (
                                    <span className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                        {item.book.categoryName}
                                    </span>
                                )}
                            </Link>

                            <div className="p-4 flex flex-col flex-grow">
                                <Link to={`/books/${item.bookId}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition">
                                        {item.bookTitle || 'Unknown Title'}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-600 mb-2">
                                    by {item.bookAuthor || 'Unknown Author'}
                                </p>

                                {item.book?.isbn && (
                                    <p className="text-xs text-gray-500 mb-3">ISBN: {item.book.isbn}</p>
                                )}

                                <div className="mt-auto">
                                    <div className="mb-3">
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${(item.bookPrice || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(item.bookId, item.bookTitle)}
                                            disabled={processingItems.has(item.bookId) || item.stockQuantity === 0}
                                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${item.stockQuantity === 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : processingItems.has(item.bookId)
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {processingItems.has(item.bookId)
                                                ? 'Adding...'
                                                : item.stockQuantity === 0
                                                    ? 'Out of Stock'
                                                    : '🛒 Add to Cart'}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item.bookId)}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                                            title="Remove from wishlist"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <Link
                                        to={`/books/${item.bookId}`}
                                        className="block mt-2 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-medium text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
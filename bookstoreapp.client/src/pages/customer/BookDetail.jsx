import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookService from '../../services/bookService';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await bookService.getBookById(id);
            setBook(data);
        } catch (err) {
            setError('Failed to load book details. Please try again.');
            console.error('Error fetching book:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart (Day 10)
        console.log('Add to cart:', { bookId: book.id, quantity });
        alert(`Added ${quantity} x "${book.title}" to cart (Coming in Day 10!)`);
    };

    const handleAddToWishlist = () => {
        // TODO: Implement add to wishlist (Day 10)
        console.log('Add to wishlist:', book.id);
        alert(`"${book.title}" added to wishlist (Coming in Day 10!)`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The book you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        );
    }

    const getStockStatus = () => {
        if (book.stockQuantity === 0) {
            return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
        } else if (book.stockQuantity < 5) {
            return { text: `Only ${book.stockQuantity} left!`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        } else {
            return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
        }
    };

    const stockStatus = getStockStatus();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/books')}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Books
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Left: Book Image */}
                        <div>
                            <div className="relative">
                                <img
                                    src={book.imageUrl || `https://via.placeholder.com/400x600/3b82f6/ffffff?text=${encodeURIComponent(book.title)}`}
                                    alt={book.title}
                                    className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md"
                                />
                                {book.categoryName && (
                                    <span className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full">
                                        {book.categoryName}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Book Details */}
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {book.title}
                            </h1>
                            <p className="text-xl text-gray-600 mb-4">
                                by <span className="font-semibold">{book.author}</span>
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">
                                    ${book.price.toFixed(2)}
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className={`inline-block px-4 py-2 ${stockStatus.bgColor} ${stockStatus.color} rounded-lg font-semibold mb-6 self-start`}>
                                {stockStatus.text}
                            </div>

                            {/* Book Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                {book.isbn && (
                                    <div>
                                        <p className="text-sm text-gray-600">ISBN</p>
                                        <p className="font-semibold">{book.isbn}</p>
                                    </div>
                                )}
                                {book.publisher && (
                                    <div>
                                        <p className="text-sm text-gray-600">Publisher</p>
                                        <p className="font-semibold">{book.publisher}</p>
                                    </div>
                                )}
                                {book.publishDate && (
                                    <div>
                                        <p className="text-sm text-gray-600">Publish Date</p>
                                        <p className="font-semibold">{new Date(book.publishDate).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {book.pageCount && (
                                    <div>
                                        <p className="text-sm text-gray-600">Pages</p>
                                        <p className="font-semibold">{book.pageCount}</p>
                                    </div>
                                )}
                                {book.language && (
                                    <div>
                                        <p className="text-sm text-gray-600">Language</p>
                                        <p className="font-semibold">{book.language}</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {book.description && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>
                            )}

                            {/* Actions for Customer */}
                            {isAuthenticated && user?.role === 'Customer' && (
                                <div className="mt-auto">
                                    {/* Quantity Selector */}
                                    {book.stockQuantity > 0 && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 bg-gray-100 rounded font-semibold">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                                                >
                                                    +
                                                </button>
                                                <span className="text-sm text-gray-600 ml-2">
                                                    (Max: {book.stockQuantity})
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={book.stockQuantity === 0}
                                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${book.stockQuantity === 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {book.stockQuantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                                        </button>
                                        <button
                                            onClick={handleAddToWishlist}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                                            title="Add to Wishlist"
                                        >
                                            ❤️
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Not Customer / Not Logged In */}
                            {!isAuthenticated && (
                                <div className="mt-auto">
                                    <Link
                                        to="/login"
                                        className="block w-full py-3 px-6 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition font-semibold"
                                    >
                                        Login to Purchase
                                    </Link>
                                </div>
                            )}

                            {isAuthenticated && user?.role !== 'Customer' && (
                                <div className="mt-auto">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800 font-medium">
                                            👋 Viewing as {user?.role}. Only customers can purchase books.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
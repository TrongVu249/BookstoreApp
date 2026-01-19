import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookService from '../../services/bookService';
import BookCard from '../../components/BookCard';

const Books = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [sortDescending, setSortDescending] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Book Status enum (matches backend)
    const bookStatuses = [
        { value: 0, label: 'Available' },
        { value: 1, label: 'Out of Stock' },
        { value: 2, label: 'Discontinued' },
        { value: 3, label: 'Coming Soon' }
    ];

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch books when filters change
    useEffect(() => {
        fetchBooks();
    }, [selectedCategory, minPrice, maxPrice, selectedStatus, sortBy, sortDescending]);

    const fetchCategories = async () => {
        try {
            const data = await bookService.getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        setError('');
        try {
            // Build search DTO matching backend pattern
            const searchDto = {
                search: searchQuery || undefined,
                categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                status: selectedStatus !== '' ? parseInt(selectedStatus) : undefined,
                sortBy: sortBy,
                sortDescending: sortDescending
            };

            const data = await bookService.getBooks(searchDto);
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load books. Please try again.');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);

        // Update URL params
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        setSearchParams(params);
    };

    const handleSortChange = (value) => {
        // Parse sort value 
        const [sortField, sortOrder] = value.split('_');
        setSortBy(sortField);
        setSortDescending(sortOrder === 'desc');
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedStatus('');
        setSortBy('title');
        setSortDescending(false);
        setSearchParams({});
    };

    // Get current sort value for dropdown
    const getCurrentSortValue = () => {
        return `${sortBy}_${sortDescending ? 'desc' : 'asc'}`;
    };

    // Check if any filters are active
    const hasActiveFilters = () => {
        return searchQuery || selectedCategory || minPrice || maxPrice || selectedStatus !== '';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        📚 Book Catalog
                    </h1>
                    <p className="text-gray-600">
                        Browse our collection of {books.length} book{books.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    {/* Main Filters Row */}
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Search Bar */}
                        <div className="md:col-span-2">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by title, author, or ISBN..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg
                                        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </form>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <select
                                value={getCurrentSortValue()}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                                <option value="price_asc">Price (Low to High)</option>
                                <option value="price_desc">Price (High to Low)</option>
                                <option value="author_asc">Author (A-Z)</option>
                                <option value="author_desc">Author (Z-A)</option>
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            <svg
                                className={`w-4 h-4 mr-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Price Range */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="Min ($)"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="Max ($)"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Statuses</option>
                                        {bookStatuses.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {hasActiveFilters() && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchQuery && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Search: "{searchQuery}"
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Category: {categories.find(c => c.id == selectedCategory)?.name}
                                </span>
                            )}
                            {minPrice && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Min: ${minPrice}
                                </span>
                            )}
                            {maxPrice && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Max: ${maxPrice}
                                </span>
                            )}
                            {selectedStatus !== '' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Status: {bookStatuses.find(s => s.value == selectedStatus)?.label}
                                </span>
                            )}
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading books...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={fetchBooks}
                            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                {!loading && !error && books.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && books.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No books found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {hasActiveFilters()
                                ? 'Try adjusting your filters or search query'
                                : 'No books available at the moment'}
                        </p>
                        {hasActiveFilters() && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;
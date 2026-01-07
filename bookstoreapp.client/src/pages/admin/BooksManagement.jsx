// src/pages/admin/BooksManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const BooksManagement = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAllBooks();
            setBooks(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load books');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?\nThis action cannot be undone.`)) {
            try {
                await adminService.deleteBook(id);
                setBooks(books.filter(book => book.id !== id));
                alert('Book deleted successfully!');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete book');
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            Available: { label: 'Available', class: 'bg-green-100 text-green-800' },
            OutOfStock: { label: 'Out of Stock', class: 'bg-red-100 text-red-800' },
            Discontinued: { label: 'Discontinued', class: 'bg-gray-100 text-gray-800' },
            ComingSoon: { label: 'Coming Soon', class: 'bg-blue-100 text-blue-800' },
        };

        const statusInfo = statusMap[status] || {
            label: 'Unknown',
            class: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || book.status.toString() === statusFilter;
        const matchesCategory = categoryFilter === '' || book.categoryId === Number(categoryFilter);
        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading books...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Books Management</h2>
                        <p className="text-gray-600 mt-1">Manage your bookstore inventory</p>
                    </div>
                    <Link
                        to="/admin/books/add"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <span className="text-xl">➕</span>
                        Add New Book
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Search Books
                            </label>
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🏷️ Filter by Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📊 Filter by Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="Available">Available</option>
                                <option value="OutOfStock">Out of Stock</option>
                                <option value="Discontinued">Discontinued</option>
                                <option value="Coming Soon">Coming Soon</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Count */}
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredBooks.length}</span> of <span className="font-semibold">{books.length}</span> books
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        ❌ {error}
                    </div>
                )}

                {/* Books Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ISBN
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <div className="text-4xl mb-2">📚</div>
                                            <p className="text-lg font-medium">No books found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={book.imageUrl || 'https://via.placeholder.com/50x75?text=No+Image'}
                                                        alt={book.title}
                                                        className="w-12 h-16 object-cover rounded mr-3"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50x75?text=No+Image';
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{book.title}</div>
                                                        <div className="text-sm text-gray-500">by {book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {book.isbn}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {book.categoryName || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                ${book.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`font-medium ${book.stockQuantity > 10 ? 'text-green-600' : book.stockQuantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {book.stockQuantity} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(book.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/admin/books/edit/${book.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(book.id, book.title)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BooksManagement;
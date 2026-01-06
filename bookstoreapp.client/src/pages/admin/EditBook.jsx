// src/pages/admin/EditBook.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        author: '',
        description: '',
        imageUrl: '',
        price: '',
        stockQuantity: '',
        publisher: '',
        publishDate: '',
        pageCount: '',
        language: '',
        categoryId: '',
        status: '0',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookData, categoriesData] = await Promise.all([
                adminService.getBook(id),
                adminService.getAllCategories()
            ]);

            // Format the data for the form
            setFormData({
                isbn: bookData.isbn || '',
                title: bookData.title || '',
                author: bookData.author || '',
                description: bookData.description || '',
                imageUrl: bookData.imageUrl || '',
                price: bookData.price.toString(),
                stockQuantity: bookData.stockQuantity.toString(),
                publisher: bookData.publisher || '',
                publishDate: bookData.publishDate ? bookData.publishDate.split('T')[0] : '',
                pageCount: bookData.pageCount?.toString() || '',
                language: bookData.language || '',
                categoryId: bookData.categoryId.toString(),
                status:
                    bookData.status === "Available" ? "0"
                        : bookData.status === "OutOfStock" ? "1"
                            : bookData.status === "Discontinued" ? "2"
                                : bookData.status === "ComingSoon" ? "3"
                                    : "0",
            });

            setCategories(categoriesData.filter(cat => cat.isActive));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load book details');
            navigate('/admin/books');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Valid stock quantity is required';
        }
        if (!formData.pageCount || Number(formData.pageCount) < 1) {
            newErrors.pageCount = 'Page count must be at least 1';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const bookData = {
                isbn: formData.isbn.trim(),
                title: formData.title.trim(),
                author: formData.author.trim(),
                language: formData.language?.trim(),

                description: formData.description?.trim() || null,
                imageUrl: formData.imageUrl?.trim() || null,
                publisher: formData.publisher?.trim() || null,

                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity, 10),
                pageCount: parseInt(formData.pageCount, 10),
                categoryId: parseInt(formData.categoryId, 10),
                status: parseInt(formData.status, 10),
                publishDate: formData.publishDate || null
            };

            console.log('UPDATE BOOK PAYLOAD', bookData);

            await adminService.updateBook(id, bookData);
            alert('✅ Book updated successfully!');
            navigate('/admin/books');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update book');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading book details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/books')}
                        className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
                    >
                        ← Back to Books
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
                    <p className="text-gray-600 mt-1">Update book information</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ISBN <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="978-0-123456-78-9"
                                />
                                {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Book title"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Author <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Author name"
                                />
                                {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Book description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Pricing & Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="29.99"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="100"
                                />
                                {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="0">Available</option>
                                    <option value="1">Out of Stock</option>
                                    <option value="2">Discontinued</option>
                                    <option value="3">Coming Soon</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Publishing Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Publishing Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publisher
                                </label>
                                <input
                                    type="text"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Publisher name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date
                                </label>
                                <input
                                    type="date"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Count
                                </label>
                                <input
                                    type="number"
                                    name="pageCount"
                                    value={formData.pageCount}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="350"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="English"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/book-cover.jpg"
                                />
                                {formData.imageUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="h-40 object-cover rounded border"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150x200?text=Invalid+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {saving ? 'Saving Changes...' : '✅ Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditBook;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete category "${name}"?\nThis action cannot be undone.`)) {
            try {
                await adminService.deleteCategory(id);
                setCategories(categories.filter(cat => cat.id !== id));
                alert('Category deleted successfully!');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus, name) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} category "${name}"?`)) {
            try {
                await adminService.toggleCategoryStatus(id);
                setCategories(categories.map(cat =>
                    cat.id === id ? { ...cat, isActive: !currentStatus } : cat
                ));
                alert(`Category ${action}d successfully!`);
            } catch (err) {
                alert(err.response?.data?.message || `Failed to ${action} category`);
            }
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Active
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ✗ Inactive
            </span>
        );
    };

    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === '' || cat.isActive.toString() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
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
                        <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
                        <p className="text-gray-600 mt-1">Manage book categories</p>
                    </div>
                    <Link
                        to="/admin/categories/add"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <span className="text-xl">➕</span>
                        Add New Category
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Search Categories
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
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
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Count */}
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredCategories.length}</span> of <span className="font-semibold">{categories.length}</span> categories
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        ❌ {error}
                    </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                            <div className="text-4xl mb-2">🏷️</div>
                            <p className="text-lg font-medium text-gray-900">No categories found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            🏷️ {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {category.description || 'No description'}
                                        </p>
                                    </div>
                                    {getStatusBadge(category.isActive)}
                                </div>

                                <div className="text-xs text-gray-500 mb-4">
                                    Created: {new Date(category.createdAt).toLocaleDateString()}
                                    {category.updatedAt && (
                                        <> • Updated: {new Date(category.updatedAt).toLocaleDateString()}</>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/categories/edit/${category.id}`}
                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-center text-sm font-medium"
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleToggleStatus(category.id, category.isActive, category.name)}
                                        className={`flex-1 px-3 py-2 rounded transition-colors text-sm font-medium ${category.isActive
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                    >
                                        {category.isActive ? '🚫 Deactivate' : '✓ Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoriesManagement;
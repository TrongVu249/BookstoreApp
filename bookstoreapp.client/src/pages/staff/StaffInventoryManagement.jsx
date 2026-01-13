import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import inventoryService from '../../services/inventoryService';

const StaffInventoryManagement = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [lowStockBooks, setLowStockBooks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        quantityChange: '',
        reason: '',
        notes: '',
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
        const bookId = searchParams.get('bookId');
        if (bookId) {
            // Auto-open modal if bookId in URL
            const book = books.find(b => b.id === parseInt(bookId));
            if (book) {
                handleOpenUpdateModal(book);
            }
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksData, logsData, lowStockData] = await Promise.all([
                inventoryService.getAllBooks(),
                inventoryService.getInventoryLogs(),
                inventoryService.getLowStockBooks(10),
            ]);
            setBooks(booksData);
            setLogs(logsData);
            setLowStockBooks(lowStockData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenUpdateModal = (book) => {
        setSelectedBook(book);
        setUpdateForm({ quantityChange: '', reason: '', notes: '' });
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedBook(null);
        setUpdateForm({ quantityChange: '', reason: '', notes: '' });
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();

        if (!updateForm.quantityChange || !updateForm.reason) {
            alert('Please fill in quantity change and reason');
            return;
        }

        setUpdating(true);
        try {
            await inventoryService.updateStock(selectedBook.id, {
                quantityChange: parseInt(updateForm.quantityChange),
                reason: updateForm.reason,
                notes: updateForm.notes || null,
            });

            alert('✅ Stock updated successfully!');
            handleCloseModal();
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update stock');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading inventory...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                    <p className="text-gray-600 mt-1">Update stock levels and track inventory changes</p>
                </div>

                {/* Books Inventory */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">📦 Book Inventory</h3>
                        <p className="text-sm text-gray-600">
                            {lowStockBooks.length > 0 && (
                                <span className="text-red-600 font-medium">⚠️ {lowStockBooks.length} items need restocking</span>
                            )}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {books.map((book) => (
                                    <tr key={book.id} className={`hover:bg-gray-50 ${(book.stockQuantity < 10 && book.status !== 'Discontinued') ? 'bg-red-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{book.title}</div>
                                            <div className="text-sm text-gray-500">{book.author}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${book.stockQuantity === 0 ? 'text-red-600' :
                                                    book.stockQuantity < 5 ? 'text-orange-600' :
                                                        book.stockQuantity < 10 ? 'text-yellow-600' :
                                                            'text-green-600'
                                                }`}>
                                                {book.stockQuantity} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-800' :
                                                book.status === 'OutOfStock' ? 'bg-red-100 text-red-800' :
                                                    book.status === 'Discontinued' ? 'bg-blue-100 text-gray-800' :
                                                        'bg-gray-100 text-blue-800'
                                                }`}>
                                                {book.status === 'Available'
                                                    ? 'Available'
                                                    : book.status === 'OutOfStock'
                                                        ? 'Out of Stock'
                                                        : book.status === 'Discontinued'
                                                            ? 'Discontinued'
                                                            : 'Coming soon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleOpenUpdateModal(book)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            >
                                                📝 Update Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Logs */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Recent Inventory Changes</h3>
                    <div className="space-y-3">
                        {logs.slice(0, 10).map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className={`text-3xl ${log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {log.quantityChange > 0 ? '📈' : '📉'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{log.bookTitle}</span>
                                        <span className={`font-bold ${log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                        <span className="font-medium">Reason:</span> {log.reason}
                                    </div>
                                    {log.notes && (
                                        <div className="text-sm text-gray-600 italic mt-1">{log.notes}</div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-2">
                                        <span className="font-medium">{log.userName}</span> • {new Date(log.loggedAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">New Stock:</div>
                                    <div className="text-lg font-bold text-gray-900">{log.quantityAfter}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Update Stock Modal */}
            {showUpdateModal && selectedBook && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4"> 
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            📝 Update Stock: {selectedBook.title}
                        </h3>
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                            <div className="text-sm text-gray-600">Current Stock:</div>
                            <div className="text-2xl font-bold text-blue-600">{selectedBook.stockQuantity} units</div>
                        </div>
                        <form onSubmit={handleUpdateStock} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity Change <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={updateForm.quantityChange}
                                    onChange={(e) => setUpdateForm({ ...updateForm, quantityChange: e.target.value })}
                                    placeholder="e.g., +50 or -20"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Use positive for increase, negative for decrease</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={updateForm.reason}
                                    onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select reason</option>
                                    <option value="Restocking">Restocking</option>
                                    <option value="Damaged Goods">Damaged Goods</option>
                                    <option value="Lost/Stolen">Lost/Stolen</option>
                                    <option value="Correction">Inventory Correction</option>
                                    <option value="Return">Customer Return</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={updateForm.notes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                    rows="3"
                                    placeholder="Additional details..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : '✅ Update Stock'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={updating}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
};

export default StaffInventoryManagement;
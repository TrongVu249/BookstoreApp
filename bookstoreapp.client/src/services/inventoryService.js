import api from './api';

const inventoryService = {

    // Get books for inventory management with optional search parameters
    getAllBooks: async (searchParams = {}) => {
        const response = await api.get('/admin/books', { params: searchParams });
        return response.data;
    },

    // Inventory Management
    updateStock: async (bookId, stockData) => {
        const response = await api.put(`/inventory/${bookId}`, stockData);
        return response.data;
    },

    getInventoryLogs: async (searchParams = {}) => {
        const response = await api.get('/inventory/logs', { params: searchParams });
        return response.data;
    },

    getLowStockBooks: async (threshold = 5) => {
        const response = await api.get('/inventory/low-stock', { params: { threshold } });
        return response.data;
    },

};

export default inventoryService;
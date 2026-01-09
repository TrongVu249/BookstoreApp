import api from './api';

const staffService = {
    // Orders 
    getAllOrders: async (searchParams = {}) => {
        const response = await api.get('/api/admin/orders', { params: searchParams });
        return response.data;
    },

    getOrder: async (id) => {
        const response = await api.get(`/api/admin/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/api/admin/orders/${id}/status`, { status });
        return response.data;
    },

    // Inventory Management
    updateStock: async (bookId, stockData) => {
        const response = await api.put(`/api/inventory/${bookId}`, stockData);
        return response.data;
    },

    getInventoryLogs: async (searchParams = {}) => {
        const response = await api.get('/api/inventory/logs', { params: searchParams });
        return response.data;
    },

    getLowStockBooks: async (threshold = 5) => {
        const response = await api.get('/api/inventory/low-stock', { params: { threshold } });
        return response.data;
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        // Get pending and processing orders
        const [pendingOrders, processingOrders, lowStockBooks] = await Promise.all([
            api.get('/api/admin/orders', { params: { status: 0 } }), // Pending
            api.get('/api/admin/orders', { params: { status: 1 } }), // Processing
            api.get('/api/inventory/low-stock', { params: { threshold: 10 } })
        ]);

        return {
            pendingOrdersCount: pendingOrders.data.length,
            processingOrdersCount: processingOrders.data.length,
            lowStockBooksCount: lowStockBooks.data.length,
        };
    },
};

export default staffService;
import api from './api';

const staffService = {
    // Orders 
    getAllOrders: async (searchParams = {}) => {
        const response = await api.get('/admin/orders', { params: searchParams });
        return response.data;
    },

    getOrder: async (id) => {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        // Get pending and processing orders
        const [pendingOrders, processingOrders, lowStockBooks] = await Promise.all([
            api.get('/admin/orders', { params: { status: 0 } }), // Pending
            api.get('/admin/orders', { params: { status: 1 } }), // Processing
            api.get('/inventory/low-stock', { params: { threshold: 10 } })
        ]);

        return {
            pendingOrdersCount: pendingOrders.data.length,
            processingOrdersCount: processingOrders.data.length,
            lowStockBooksCount: lowStockBooks.data.length,
        };
    },
};

export default staffService;
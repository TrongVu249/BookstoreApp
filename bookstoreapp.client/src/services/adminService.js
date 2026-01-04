import api from './api';

const adminService = {

    // Get statistics
    getStatistics: async () => {
        const response = await api.get('/admin/dashboard/statistics');
        return response.data;
    },

    /*
    // Books Management
    getAllBooks: async () => {
        const response = await api.get('/api/books');
        return response.data;
    },

    createBook: async (bookData) => {
        const response = await api.post('/api/books', bookData);
        return response.data;
    },

    updateBook: async (id, bookData) => {
        const response = await api.put(`/api/books/${id}`, bookData);
        return response.data;
    },

    deleteBook: async (id) => {
        const response = await api.delete(`/api/books/${id}`);
        return response.data;
    },

    // Users Management
    getAllUsers: async () => {
        const response = await api.get('/api/users');
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/api/users/${id}`, userData);
        return response.data;
    },

    toggleUserStatus: async (id) => {
        const response = await api.put(`/api/users/${id}/toggle-status`);
        return response.data;
    },

    // Orders Management
    getAllOrders: async () => {
        const response = await api.get('/api/orders/all');
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/api/orders/${id}/status`, { status });
        return response.data;
    },

    // Categories Management
    getAllCategories: async () => {
        const response = await api.get('/api/categories');
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/api/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/api/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/api/categories/${id}`);
        return response.data;
    },
    */
};

export default adminService;
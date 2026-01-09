import api from './api';

const adminService = {
    // Get statistics
    getStatistics: async () => {
        const response = await api.get('/admin/dashboard/statistics');
        return response.data;
    },

    // Books Management
    getAllBooks: async (searchParams = {}) => {
        const response = await api.get('/admin/books', { params: searchParams });
        return response.data;
    },

    getBook: async (id) => {
        const response = await api.get(`/admin/books/${id}`);
        return response.data;
    },

    createBook: async (bookData) => {
        const response = await api.post('/admin/books', bookData);
        return response.data;
    },

    updateBook: async (id, bookData) => {
        const response = await api.put(`/admin/books/${id}`, bookData);
        return response.data;
    },

    deleteBook: async (id) => {
        const response = await api.delete(`/admin/books/${id}`);
        return response.data;
    },

    updateBookStock: async (id, quantity) => {
        const response = await api.patch(`/admin/books/${id}/stock`, quantity, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    // Users Management
    getAllUsers: async (searchParams = {}) => {
        const response = await api.get('/admin/users', { params: searchParams });
        return response.data;
    },

    getUser: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    toggleUserStatus: async (id) => {
        const response = await api.patch(`/admin/users/${id}/toggle-active`);
        return response.data;
    },

    assignRole: async (id, role) => {
        const response = await api.patch(`/admin/users/${id}/assign-role`, role, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    // Orders Management
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

    cancelOrder: async (id) => {
        const response = await api.post(`/admin/orders/${id}/cancel`);
        return response.data;
    },

    getOrderStatistics: async () => {
        const response = await api.get('/admin/orders/statistics');
        return response.data;
    },

    // Categories Management
    getAllCategories: async (searchParams = {}) => {
        const response = await api.get('/admin/categories', { params: searchParams });
        return response.data;
    },

    getCategory: async (id) => {
        const response = await api.get(`/admin/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    },

    toggleCategoryStatus: async (id) => {
        const response = await api.patch(`/admin/categories/${id}/toggle-status`);
        return response.data;
    },
};

export default adminService;
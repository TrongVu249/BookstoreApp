import api from './api';

const orderService = {
    // Create new order from cart
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to create order';
        }
    },

    // Get all orders for current user
    getMyOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch orders';
        }
    },

    // Get specific order details
    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch order details';
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await api.post(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to cancel order';
        }
    },
};

export default orderService;
import api from './api';

const cartService = {
    // Get current user's cart
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch cart';
        }
    },

    // Add book to cart
    addToCart: async (bookId, quantity = 1) => {
        try {
            const response = await api.post('/cart', { bookId, quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to add to cart';
        }
    },

    // Update cart item quantity
    updateCartItem: async (id, quantity) => {
        try {
            const response = await api.put(`/cart/${id}`, { quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to update cart item';
        }
    },

    // Remove item from cart
    removeFromCart: async (bookId) => {
        try {
            const response = await api.delete(`/cart/${bookId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to remove from cart';
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const response = await api.delete('/cart');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to clear cart';
        }
    },

    // Get cart item count
    getCartCount: async () => {
        try {
            const response = await api.get('/cart/count');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch cart count';
        }
    },
};

export default cartService;
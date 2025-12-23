import api from './api';

const wishlistService = {
    // Get current user's wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch wishlist';
        }
    },

    // Add book to wishlist
    addToWishlist: async (bookId) => {
        try {
            const response = await api.post('/wishlist', { bookId });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to add to wishlist';
        }
    },

    // Remove book from wishlist
    removeFromWishlist: async (bookId) => {
        try {
            const response = await api.delete(`/wishlist/${bookId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to remove from wishlist';
        }
    },

    // Check if book is in wishlist
    checkInWishlist: async (bookId) => {
        try {
            const response = await api.get(`/wishlist/check/${bookId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || false;
        }
    },

    // Clear entire wishlist
    clearWishlist: async () => {
        try {
            const response = await api.delete('/wishlist');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to clear wishlist';
        }
    },
};

export default wishlistService;
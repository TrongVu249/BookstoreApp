import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Registration failed';
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        } catch (error) {
            throw error.response?.data || 'Login failed';
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user');
                return null;
            }
        }
        return null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
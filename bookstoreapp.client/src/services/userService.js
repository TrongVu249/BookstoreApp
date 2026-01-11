// src/services/userService.js
import api from './api';

const userService = {
    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/api/users/profile');
        return response.data;
    },

    // Update current user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/api/users/profile', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.post('/api/users/change-password', passwordData);
        return response.data;
    },
};

export default userService;
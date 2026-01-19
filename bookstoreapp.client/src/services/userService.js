import api from './api';

const userService = {
    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update current user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.post('/users/change-password', passwordData);
        return response.data;
    },
};

export default userService;
import axios from 'axios';

// Base url for the backend API
const API_BASE_URL = 'https://localhost:7102/api';


// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token to headers if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific status codes if needed
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden access
                    alert('You do not have permission to perform this action.');
                    break;
                case 500:
                    // Handle server errors
                    alert('A server error occurred. Please try again later.');
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
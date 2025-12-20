import api from './api';

const bookService = {
    // Get all books with optional filters matching backend BookSearchDto
    getBooks: async (searchDto = {}) => {
        try {
            const params = new URLSearchParams();

            // Search term (title, author, ISBN)
            if (searchDto.search) {
                params.append('Search', searchDto.search);
            }

            // Category filter
            if (searchDto.categoryId) {
                params.append('CategoryId', searchDto.categoryId);
            }

            // Price range
            if (searchDto.minPrice !== undefined && searchDto.minPrice !== null) {
                params.append('MinPrice', searchDto.minPrice);
            }
            if (searchDto.maxPrice !== undefined && searchDto.maxPrice !== null) {
                params.append('MaxPrice', searchDto.maxPrice);
            }

            // Status filter
            if (searchDto.status !== undefined && searchDto.status !== null) {
                params.append('Status', searchDto.status);
            }

            // Sorting
            if (searchDto.sortBy) {
                params.append('SortBy', searchDto.sortBy);
            }
            if (searchDto.sortDescending !== undefined) {
                params.append('SortDescending', searchDto.sortDescending);
            }

            const response = await api.get(`/books?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch books';
        }
    },

    // Get single book by ID
    getBookById: async (id) => {
        try {
            const response = await api.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch book details';
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Failed to fetch categories';
        }
    },
};

export default bookService;
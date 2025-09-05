// apiService.js - API Service for communicating with Spring Boot backend
import axios from 'axios';

// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/practical4-backend/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Product API Services
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (product) => {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update existing product
  updateProduct: async (id, product) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Search products by name
  searchProducts: async (keyword) => {
    try {
      const response = await api.get(`/products/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  }
};

// Attendant API Services
export const attendantService = {
  // Get all attendants
  getAllAttendants: async () => {
    try {
      const response = await api.get('/attendants');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendants:', error);
      throw error;
    }
  },

  // Get attendant by ID
  getAttendantById: async (id) => {
    try {
      const response = await api.get(`/attendants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendant ${id}:`, error);
      throw error;
    }
  },

  // Create new attendant
  createAttendant: async (attendant) => {
    try {
      const response = await api.post('/attendants', attendant);
      return response.data;
    } catch (error) {
      console.error('Error creating attendant:', error);
      throw error;
    }
  },

  // Update existing attendant
  updateAttendant: async (id, attendant) => {
    try {
      const response = await api.put(`/attendants/${id}`, attendant);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendant ${id}:`, error);
      throw error;
    }
  },

  // Delete attendant
  deleteAttendant: async (id) => {
    try {
      await api.delete(`/attendants/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting attendant ${id}:`, error);
      throw error;
    }
  },

  // Search attendants by name
  searchAttendants: async (keyword) => {
    try {
      const response = await api.get(`/attendants/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error searching attendants:', error);
      throw error;
    }
  },

  // Get attendant by email
  getAttendantByEmail: async (email) => {
    try {
      const response = await api.get(`/attendants/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendant with email ${email}:`, error);
      throw error;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Test backend connection
  testConnection: async () => {
    try {
      await api.get('/products');
      return { success: true, message: 'Backend connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Backend connection failed. Please ensure Spring Boot application is running on port 8080.' 
      };
    }
  },

  // Format error message from API response
  formatErrorMessage: (error) => {
    if (error.response?.data) {
      return typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.message || 'An error occurred';
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};

export default api;
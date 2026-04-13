/**
 * API Configuration and Base Service
 * Centralized API configuration for database integration
 */

// API Base URL - can be overridden via environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hh-asia-tyre-crm-inv-sys.vercel.app/api';

// API Endpoints
export const ENDPOINTS = {
  // Bookings
  BOOKINGS: '/public/bookings',
  BOOKING_BY_ID: (id) => `/public/bookings/${id}`,
  BOOKINGS_BY_BRANCH: (branchCode) => `/public/bookings/branch/${branchCode}`,
  BOOKINGS_BY_DATE: (branchCode, date) => `/public/bookings/branch/${branchCode}/date/${date}`,
  CHECK_SLOT_AVAILABILITY: (branchCode, date, time) => 
    `/public/bookings/availability?branch=${branchCode}&date=${date}&time=${time}`,
  
  // Branches
  BRANCHES: '/public/branches',
  BRANCH_BY_ID: (id) => `/public/branches/${id}`,
  
  // Services
  SERVICES: '/public/services',
  
  // Admin (authenticated)
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_ANALYTICS: '/admin/analytics',
};

// Default headers
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// Add authentication token if available
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? {
    ...getDefaultHeaders(),
    'Authorization': `Bearer ${token}`,
  } : getDefaultHeaders();
};

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: options.auth ? getAuthHeaders() : getDefaultHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data?.message || data || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      status: error.response?.status || 500,
    };
  }
};

/**
 * GET request
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * POST request
 */
export const post = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * PUT request
 */
export const put = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * DELETE request
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

/**
 * Check if API is available (health check)
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

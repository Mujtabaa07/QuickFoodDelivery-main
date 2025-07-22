const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Utility function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      console.error('API Error Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Provide more specific error messages
      let errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
      
      if (response.status === 404) {
        errorMessage = 'Resource not found';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (response.status >= 400 && response.status < 500) {
        errorMessage = data?.message || 'Request failed';
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', {
      url,
      error: error instanceof Error ? error.message : error
    });
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      // Network or timeout errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      }
      throw error;
    }
    throw new Error('Network request failed');
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Restaurant API functions
export const restaurantAPI = {
  getAll: async (filters?: { category?: string; search?: string; location?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.location) params.append('location', filters.location);
    
    const queryString = params.toString();
    return apiRequest(`/restaurants${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/restaurants/${id}`);
  },

  create: async (restaurantData: any) => {
    return apiRequest('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  },

  update: async (id: string, restaurantData: any) => {
    return apiRequest(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  },
};

// Food API functions
export const foodAPI = {
  getAll: async (filters?: { 
    restaurant?: string; 
    category?: string; 
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.restaurant) params.append('restaurant', filters.restaurant);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    const queryString = params.toString();
    return apiRequest(`/foods${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/foods/${id}`);
  },

  create: async (foodData: any) => {
    return apiRequest('/foods', {
      method: 'POST',
      body: JSON.stringify(foodData),
    });
  },

  update: async (id: string, foodData: any) => {
    return apiRequest(`/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/foods/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order API functions
export const orderAPI = {
  create: async (orderData: {
    restaurantId: string;
    items: Array<{
      foodId: string;
      quantity: number;
      price: number;
    }>;
    deliveryAddress: string;
    totalAmount: number;
  }) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },
};

// Admin API functions
export const adminAPI = {
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard/stats');
  },

  getAnalytics: async (period?: string) => {
    const params = period ? `?period=${period}` : '';
    return apiRequest(`/admin/analytics${params}`);
  },

  // Orders management
  getOrders: async (page = 1, limit = 10, status = 'all') => {
    return apiRequest(`/admin/orders?page=${page}&limit=${limit}&status=${status}`);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Restaurants management
  getRestaurants: async (page = 1, limit = 10, status = 'all') => {
    return apiRequest(`/admin/restaurants?page=${page}&limit=${limit}&status=${status}`);
  },

  updateRestaurantStatus: async (restaurantId: string, status: string) => {
    return apiRequest(`/admin/restaurants/${restaurantId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Users management
  getUsers: async (page = 1, limit = 10, role = 'all') => {
    return apiRequest(`/admin/users?page=${page}&limit=${limit}&role=${role}`);
  },

  updateUserStatus: async (userId: string, isActive: boolean) => {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },
};

export default {
  auth: authAPI,
  restaurants: restaurantAPI,
  foods: foodAPI,
  orders: orderAPI,
  admin: adminAPI,
};

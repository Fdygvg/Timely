import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // IMPORTANT for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed (though we use cookies)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Clear user state
      localStorage.removeItem('temp_token');
      // You might want to redirect to login here
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: { error: 'Network error. Please check your connection.' }
      };
    }

    return Promise.reject(error);
  }
);

export { api };
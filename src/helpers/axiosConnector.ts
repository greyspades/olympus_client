import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Adjust the base URL according to your API configuration
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const authToken = sessionStorage.getItem('token');

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

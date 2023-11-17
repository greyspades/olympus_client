import axios from 'axios';

const server = axios.create({
  baseURL: '/api', // Adjust the base URL according to your API configuration
});

// Add a request interceptor to include the token in the headers
server.interceptors.request.use(
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

export default server;

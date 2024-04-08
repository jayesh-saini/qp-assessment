import axios from 'axios';
import settings from '../settings';

const { SERVER_BASE_URL } = settings

const api = axios.create({
  baseURL: SERVER_BASE_URL, // our API base URL
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.access_token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
    (response) => {
        if(response.data.status == 401) {
            localStorage.clear()
            window.location.replace(`${window.origin}/login`)
        }
        return response;
    },
    (error) => {
        // Handle response errors
        console.error('Response error:', error.response);
        return Promise.reject(error);
    }
)

// Export the api instance
export default api;
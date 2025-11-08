import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[API Request]', config.method?.toUpperCase(), config.url);
  console.log('[Token Status]', token ? '✅ Present' : '❌ Missing');
  if (config.params) {
    console.log('[Request Params]', config.params);
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

client.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data?.message || error.message);
    
    // Auto-redirect to login on 401 (Invalid session / Not authenticated)
    if (error.response?.status === 401) {
      console.warn('🚫 Session expired or invalid - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;



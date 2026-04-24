import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// We use the local IP of your machine so the mobile device can connect
const BASE_URL = 'http://192.168.1.6:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

// Configure Axios to automatically attach JWT tokens
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('client_access');
      const url = config.url || '';
      
      const isPublicRoute = url.includes('login') || 
                            url.includes('register') || 
                            url.includes('medicines');
      
      if (token && !isPublicRoute) {
        // Use set method if available, otherwise direct assignment
        if (config.headers && typeof config.headers.set === 'function') {
           config.headers.set('Authorization', `Bearer ${token}`);
        } else {
           config.headers = {
             ...(config.headers || {}),
             Authorization: `Bearer ${token}`
           } as any;
        }
        console.log(`[API] Auth attached to: ${url}`);
      } else if (!isPublicRoute) {
        console.warn(`[API] NO TOKEN for private route: ${url}`);
      }
    } catch (e) {
      console.error('[API] Request Interceptor Error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout on token expiration/invalid
      await SecureStore.deleteItemAsync('client_access');
      await SecureStore.deleteItemAsync('client_refresh');
      // The Root Layout will handle the redirect based on the missing token
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) {
     return url.replace('localhost', '192.168.1.6').replace('127.0.0.1', '192.168.1.6');
  }
  return `${BASE_URL.replace('/api/', '')}${url}`;
};

export default api;
export { BASE_URL };

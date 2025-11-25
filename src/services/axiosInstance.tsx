import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Config from '@/config';

const API_BASE_URL = Config.API_BASE_URL;

// Validate API_BASE_URL is set
if (!API_BASE_URL) {
  console.error('API_BASE_URL is not defined! Please set NEXT_PUBLIC_API_BASE_URL or API_BASE_URL in your environment variables.');
}

// Create axios instance with credentials to send cookies
const apiInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || '', // Fallback to empty string if undefined
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Request interceptor to validate API_BASE_URL and prevent caching
apiInstance.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not configured. Request will fail:', config.url);
      return Promise.reject(new Error('API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.'));
    }
    
    // Prevent browser caching by adding cache-control headers and removing conditional headers
    config.headers = config.headers || {};
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    
    // Remove conditional request headers to prevent 304 responses
    delete config.headers['If-None-Match'];
    delete config.headers['If-Modified-Since'];
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

// Helper: run queued requests after refresh
const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

// Helper: clear cookies
export const clearCookies = () => {
  if (typeof document !== 'undefined') {
    // Clear all cookies by setting them to expire in the past
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
  }
};

export const setCookie = (name: string, value: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${value};path=/`;
    document.cookie = `${name}=${value};path=/;domain=${window.location.hostname}`;
  }
};

// Response interceptor - handle 401 + refresh
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Don't try to refresh token for auth endpoints (login, logout, refresh)
    // These endpoints should return their errors directly
    const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                          requestUrl.includes('/auth/google-login') || 
                          requestUrl.includes('/auth/logout') || 
                          requestUrl.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise<void>(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh endpoint will receive cookies automatically via withCredentials
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        setCookie('access_token', res.data.access_token);
        setCookie('refresh_token', res.data.refresh_token);

        // Cookies are automatically set by the server response
        processQueue(null);

        return apiInstance(originalRequest);
      } catch (err) {
        processQueue(err instanceof Error ? err : new Error(String(err)));
        // Clear cookies and redirect to login
        clearCookies();
        window.location.href = '/login';
        console.warn('Session expired. Redirect to login.');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
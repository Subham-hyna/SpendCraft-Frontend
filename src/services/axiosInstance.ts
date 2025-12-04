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
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
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
export const removeCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }
};

export const setCookie = (name: string, value: string) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 3000 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const setToken = (name: string, value: string) => {
  if (typeof window !== 'undefined' && localStorage) {
    localStorage.setItem(name, value);
  }
};

// Helper: get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined' && localStorage) {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper: get refresh token from localStorage
const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined' && localStorage) {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

// Helper: clear tokens from localStorage
export const clearTokens = () => {
  if (typeof window !== 'undefined' && localStorage) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    // Navigate to login page
    window.location.href = '/login';
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
        const refreshToken = getRefreshToken();

        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,{
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = res.data.access_token;
        setToken('access_token', newAccessToken);

        if (apiInstance.defaults.headers) {
          apiInstance.defaults.headers.Authorization = 'Bearer ' + newAccessToken;
        }

        // Cookies are automatically set by the server response
        processQueue(null);

        return apiInstance(originalRequest);
      } catch (err) {
        processQueue(err instanceof Error ? err : new Error(String(err)));
        // Clear cookies and redirect to login
        removeCookie('access_token');
        clearTokens();
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
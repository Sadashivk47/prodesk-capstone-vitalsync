import axios from 'axios';
import { toast } from '../components/ui/Toast';

const TOKEN_KEY = 'vitalsync_jwt_token';

function resolveBaseUrl(): string {
  // 1. Prefer the env var if Next.js injected it at build time
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 2. In the browser: derive from current origin, always targeting port 3001
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }
  // 3. SSR / build fallback
  return 'http://localhost:3001/api';
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch errors and display user-friendly Toast messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      let title = 'Request Failed';
      let userMessage: string | string[] = 'An unexpected error occurred. Please try again.';

      if (statusCode === 400) {
        title = 'Bad Request / Validation Error';
      } else if (statusCode === 401) {
        title = 'Authentication Error';
      } else if (statusCode === 403) {
        title = 'Access Denied';
      } else if (statusCode === 404) {
        title = 'Not Found';
      } else if (statusCode === 409) {
        title = 'Resource Conflict';
      } else if (statusCode === 429) {
        title = 'Rate Limit Exceeded';
        userMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (statusCode >= 500) {
        title = 'Server Error';
        userMessage = 'An unexpected server error occurred. Please try again later.';
      }

      if (responseData && responseData.message) {
        if (Array.isArray(responseData.message)) {
          userMessage = responseData.message;
        } else if (typeof responseData.message === 'string' && statusCode !== 500) {
          userMessage = responseData.message;
        }
      } else if (error.message === 'Network Error' || !error.response) {
        title = 'Connection Error';
        userMessage = 'Unable to connect to VitalSync server. Please check backend connection.';
      }

      toast.error(userMessage, title);
    }
    return Promise.reject(error);
  }
);

export default apiClient;


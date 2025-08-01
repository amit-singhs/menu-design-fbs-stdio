// API Configuration

export const API_CONFIG = {
  AUTH_SERVICE_ENDPOINT: process.env.NEXT_PUBLIC_AUTH_SERVICE_ENDPOINT || process.env.AUTH_SERVICE_ENDPOINT || '',
  AUTH_SERVICE_API_KEY: process.env.NEXT_PUBLIC_AUTH_SERVICE_API_KEY || process.env.AUTH_SERVICE_API_KEY || '',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_TOKEN: '/verify-token',
} as const;

// Validate required environment variables
export const validateApiConfig = () => {
  if (!API_CONFIG.AUTH_SERVICE_ENDPOINT) {
    throw new Error('AUTH_SERVICE_ENDPOINT is not configured');
  }
  if (!API_CONFIG.AUTH_SERVICE_API_KEY) {
    throw new Error('AUTH_SERVICE_API_KEY is not configured');
  }
}; 
// API Client with authentication headers and error handling

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { 
  ApiError, 
  LoginResponse, 
  RegisterResponse, 
  ForgotPasswordResponse, 
  VerifyTokenResponse 
} from './types';

class ApiClient {
  private baseURL: string;

  constructor() {
    // Use local API routes instead of external service directly
    this.baseURL = API_CONFIG.AUTH_SERVICE_ENDPOINT;
    
    console.log('API Client initialized with:', {
      baseURL: this.baseURL
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Debug logging
    console.log('API Request:', {
      url,
      baseURL: this.baseURL,
      endpoint
    });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }));

        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Authentication methods
  async login(user_name: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ user_name, password }),
      headers: {
        'x-api-key':API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  async register(data: {
    name: string;
    user_name: string;
    mobile: string;
    password: string;
  }): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-api-key':API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  async forgotPassword(user_name: string): Promise<ForgotPasswordResponse> {
    return this.request<ForgotPasswordResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ user_name }),
    });
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    return this.request<VerifyTokenResponse>('/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiClient = new ApiClient(); 
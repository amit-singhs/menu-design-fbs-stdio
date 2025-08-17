// API Client with authentication headers and error handling

import { API_CONFIG, API_ENDPOINTS } from './config';
import { getCookie, COOKIE_KEYS } from '../cookies';
import type { 
  ApiError, 
  LoginResponse, 
  RegisterResponse, 
  ForgotPasswordResponse, 
  VerifyTokenResponse,
  CreateKitchenStaffRequest,
  CreateKitchenStaffResponse,
  GetKitchenStaffResponse,
  DeleteKitchenStaffRequest,
  DeleteKitchenStaffResponse,
  StaffLoginRequest,
  StaffLoginResponse,
  KitchenOrder,
  GetOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse
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
    
    // Get JWT token from cookies
    const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

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

  private async ordersRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const ordersBaseURL = API_CONFIG.ORDERS_MANAGEMENT_ENDPOINT;
    const url = `${ordersBaseURL}${endpoint}`;
    
    // Debug logging
    console.log('Orders API Request:', {
      url,
      ordersBaseURL,
      endpoint
    });
    
    // Get staff JWT token from cookies
    const token = getCookie(COOKIE_KEYS.STAFF_AUTH_TOKEN);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

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

  // Kitchen Staff Management methods
  async createKitchenStaff(data: CreateKitchenStaffRequest): Promise<CreateKitchenStaffResponse> {
    return this.request<CreateKitchenStaffResponse>(API_ENDPOINTS.CREATE_KITCHEN_STAFF, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-api-key': API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  async getKitchenStaff(restaurantId: string): Promise<GetKitchenStaffResponse> {
    return this.request<GetKitchenStaffResponse>(`${API_ENDPOINTS.GET_KITCHEN_STAFF}?restaurantId=${restaurantId}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  async deleteKitchenStaff(data: DeleteKitchenStaffRequest): Promise<DeleteKitchenStaffResponse> {
    return this.request<DeleteKitchenStaffResponse>(API_ENDPOINTS.DELETE_KITCHEN_STAFF, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-api-key': API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  async staffLogin(data: StaffLoginRequest): Promise<StaffLoginResponse> {
    return this.request<StaffLoginResponse>(API_ENDPOINTS.STAFF_LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-api-key': API_CONFIG.AUTH_SERVICE_API_KEY
      },
    });
  }

  // Orders Management methods
  async getOrders(): Promise<KitchenOrder[]> {
    return this.ordersRequest<KitchenOrder[]>(API_ENDPOINTS.GET_ORDERS, {
      method: 'GET',
      headers: {
        'x-api-key': API_CONFIG.ORDERS_MANAGEMENT_API_KEY
      },
    });
  }

  async updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    return this.ordersRequest<UpdateOrderStatusResponse>(`${API_ENDPOINTS.UPDATE_ORDER_STATUS}/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'x-api-key': API_CONFIG.ORDERS_MANAGEMENT_API_KEY
      },
    });
  }
}

export const apiClient = new ApiClient(); 
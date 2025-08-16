// Order Management API Client
// Public API - no authentication required

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  OrderStatusResponse,
  ApiError 
} from './types';

class OrderApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.ORDERS_MANAGEMENT_ENDPOINT;
    
    console.log('Order API Client initialized with:', {
      baseURL: this.baseURL
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('Order API Request:', {
      url,
      baseURL: this.baseURL,
      endpoint,
      method: options.method || 'GET'
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

  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>(API_ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Get order status by order ID
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    return this.request<OrderStatusResponse>(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
      method: 'GET',
    });
  }
}

export const orderApiClient = new OrderApiClient(); 
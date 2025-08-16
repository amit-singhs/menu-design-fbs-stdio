// Authentication API Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  restaurant: {
    restaurnatId: string;
    userId: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// JWT Token Payload
export interface JWTPayload {
  restaurantId: string;
  userId: string;
  email: string;
  role: string;
  menuId?: string; // Optional menuId field
  iat?: number;
  exp?: number;
}

// Order Management API Types
export interface OrderItem {
  menu_item_id: string;
  quantity: string;
  instructions?: string;
}

export interface CreateOrderRequest {
  restaurant_id: string;
  table_number: string;
  instructions?: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface OrderItemDetail {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusResponse {
  id: string;
  restaurant_id: string;
  table_number: string;
  total_amount: number;
  instructions?: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItemDetail[];
} 
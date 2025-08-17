// Authentication API Types

export interface LoginRequest {
  user_name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  user_name: string;
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
  user_name: string;
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
    user_name: string;
  };
}

// Kitchen Staff Management Types
export interface CreateKitchenStaffRequest {
  user_name: string;
  password: string;
  role: string;
}

export interface CreateKitchenStaffResponse {
  message: string;
  user: {
    id: string;
    user_name: string;
    role: string;
  };
}

export interface DeleteKitchenStaffRequest {
  user_id: string;
}

export interface DeleteKitchenStaffResponse {
  message: string;
  deletedUser: {
    id: string;
    user_name: string;
    role: string;
  };
}

// Staff Login Types
export interface StaffLoginRequest {
  user_name: string;
  password: string;
  role: string;
}

export interface StaffLoginResponse {
  token: string;
}

// Orders Management Types
export interface KitchenOrderItem {
  id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  instructions?: string;
  menu_item_id: string;
}

export interface KitchenOrder {
  id: string;
  restaurant_id: string;
  table_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  instructions?: string;
  created_at: string;
  updated_at: string;
  order_items: KitchenOrderItem[];
}

export interface GetOrdersResponse {
  orders: KitchenOrder[];
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: KitchenOrder;
}

export interface KitchenStaff {
  id: string;
  user_name: string;
  role: string;
}

export interface GetKitchenStaffResponse {
  message: string;
  restaurantId: string;
  staffCount: number;
  staff: KitchenStaff[];
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
  user_name: string;
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
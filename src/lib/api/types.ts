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
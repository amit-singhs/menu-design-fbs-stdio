// Authentication service with TanStack Query hooks

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyTokenRequest,
  VerifyTokenResponse
} from './types';

// Query keys for caching
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  token: () => [...authQueryKeys.all, 'token'] as const,
} as const;

// Login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      return apiClient.login(credentials.user_name, credentials.password);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      return apiClient.register(data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
      return apiClient.forgotPassword(data.user_name);
    },
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
};

// Verify token query
export const useVerifyToken = (token: string | null) => {
  return useQuery({
    queryKey: [...authQueryKeys.token(), token],
    queryFn: async (): Promise<VerifyTokenResponse> => {
      if (!token) throw new Error('No token provided');
      return apiClient.verifyToken(token);
    },
    enabled: !!token,
    retry: false, // Don't retry token verification
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Invalidate auth queries
export const invalidateAuthQueries = () => {
  // This will be used in the auth context to clear cached data on logout
  return authQueryKeys.all;
}; 
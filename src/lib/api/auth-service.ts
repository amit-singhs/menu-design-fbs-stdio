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
  VerifyTokenResponse,
  CreateKitchenStaffRequest,
  CreateKitchenStaffResponse,
  GetKitchenStaffResponse,
  DeleteKitchenStaffRequest,
  DeleteKitchenStaffResponse,
  StaffLoginRequest,
  StaffLoginResponse,
  KitchenOrder,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse
} from './types';

// Query keys for caching
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  token: () => [...authQueryKeys.all, 'token'] as const,
  kitchenStaff: () => [...authQueryKeys.all, 'kitchen-staff'] as const,
  orders: () => [...authQueryKeys.all, 'orders'] as const,
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

// Kitchen Staff Management
export const useCreateKitchenStaff = () => {
  return useMutation({
    mutationFn: async (data: CreateKitchenStaffRequest): Promise<CreateKitchenStaffResponse> => {
      return apiClient.createKitchenStaff(data);
    },
    onError: (error) => {
      console.error('Create kitchen staff failed:', error);
    },
  });
};

export const useGetKitchenStaff = (restaurantId: string | null) => {
  return useQuery({
    queryKey: [...authQueryKeys.kitchenStaff(), restaurantId],
    queryFn: async (): Promise<GetKitchenStaffResponse> => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      return apiClient.getKitchenStaff(restaurantId);
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });
};

export const useDeleteKitchenStaff = () => {
  return useMutation({
    mutationFn: async (data: DeleteKitchenStaffRequest): Promise<DeleteKitchenStaffResponse> => {
      return apiClient.deleteKitchenStaff(data);
    },
    onError: (error) => {
      console.error('Delete kitchen staff failed:', error);
    },
  });
};

export const useStaffLogin = () => {
  return useMutation({
    mutationFn: async (credentials: StaffLoginRequest): Promise<StaffLoginResponse> => {
      return apiClient.staffLogin(credentials);
    },
    onError: (error) => {
      console.error('Staff login failed:', error);
    },
  });
};

// Orders Management
export const useGetOrders = () => {
  return useQuery({
    queryKey: [...authQueryKeys.orders()],
    queryFn: async (): Promise<KitchenOrder[]> => {
      return apiClient.getOrders();
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: UpdateOrderStatusRequest['status'] }): Promise<UpdateOrderStatusResponse> => {
      return apiClient.updateOrderStatus(orderId, { status });
    },
    onError: (error) => {
      console.error('Update order status failed:', error);
    },
  });
}; 
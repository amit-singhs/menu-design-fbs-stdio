// Order API Hook
// Custom hook for order management operations

import { useState } from 'react';
import { orderApiClient } from '@/lib/api/order-client';
import type { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  OrderStatusResponse 
} from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

export const useOrderApi = () => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isLoadingOrderStatus, setIsLoadingOrderStatus] = useState(false);
  const { toast } = useToast();

  // Create a new order
  const createOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse | null> => {
    setIsCreatingOrder(true);
    
    try {
      const response = await orderApiClient.createOrder(orderData);
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${response.id} has been placed and is being prepared.`,
      });
      
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Get order status
  const getOrderStatus = async (orderId: string): Promise<OrderStatusResponse | null> => {
    setIsLoadingOrderStatus(true);
    
    try {
      const response = await orderApiClient.getOrderStatus(orderId);
      return response;
    } catch (error) {
      console.error('Error fetching order status:', error);
      
      toast({
        title: 'Failed to Load Order',
        description: error instanceof Error ? error.message : 'Failed to load order status. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsLoadingOrderStatus(false);
    }
  };

  return {
    createOrder,
    getOrderStatus,
    isCreatingOrder,
    isLoadingOrderStatus,
  };
}; 
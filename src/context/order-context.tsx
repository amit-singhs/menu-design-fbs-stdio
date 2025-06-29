'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem } from '@/components/menu';

export type OrderStatus = 'placed' | 'preparing' | 'ready';

export type Order = {
  id: string;
  cart: CartItem[];
  tableNumber: string;
  status: OrderStatus;
  createdAt: Date;
};

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'placed',
      createdAt: new Date(),
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);
  
  const getOrderById = useCallback((orderId: string): Order | undefined => {
      return orders.find(o => o.id === orderId);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

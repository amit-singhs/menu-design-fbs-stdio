
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { z } from 'zod';
import type { menuItemSchema } from '@/components/menu-form';

export type MenuItem = z.infer<typeof menuItemSchema>;

export type CartItem = MenuItem & {
  quantity: number;
  specialInstructions?: string;
};

export type OrderStatus = 'placed' | 'preparing' | 'ready';

export type Order = {
  id: string;
  cart: CartItem[];
  tableNumber: string;
  status: OrderStatus;
  createdAt: Date;
  statusUpdatedAt: Date;
  specialInstructions?: string;
};

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'statusUpdatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock data for demonstration purposes. We define it outside to prevent re-creation on re-renders.
const MOCK_ORDERS: Order[] = [
  {
    id: 'mock-1',
    cart: [
      { dishName: 'Spaghetti Carbonara', price: 15.99, description: 'Classic Italian pasta.', quantity: 1, specialInstructions: 'Extra cheese please', category: 'Main Courses', subcategory: 'Pasta Dishes' },
      { dishName: 'Garlic Bread', price: 5.99, description: 'Toasted with garlic butter.', quantity: 2, category: 'Appetizers' },
    ],
    tableNumber: '5',
    status: 'placed',
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    statusUpdatedAt: new Date(Date.now() - 2 * 60 * 1000), 
    specialInstructions: 'Allergic to nuts.'
  },
  {
    id: 'mock-2',
    cart: [
      { dishName: 'Margherita Pizza', price: 12.99, description: 'Tomato, mozzarella, basil.', quantity: 1, category: 'Main Courses', subcategory: 'Pizza' },
    ],
    tableNumber: '12',
    status: 'preparing',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    statusUpdatedAt: new Date(Date.now() - 3 * 60 * 1000),
  },
    {
    id: 'mock-3',
    cart: [
      { dishName: 'Caesar Salad', price: 10.50, description: 'Fresh and crispy.', quantity: 1, specialInstructions: 'No croutons.', category: 'Appetizers', subcategory: 'Salads' },
      { dishName: 'Iced Tea', price: 3.00, description: 'Refreshing drink.', quantity: 1, category: 'Drinks' },
    ],
    tableNumber: '8',
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    statusUpdatedAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 'mock-4',
    cart: [
      { dishName: 'Cheeseburger', price: 14.00, description: 'With fries.', quantity: 1, category: 'Main Courses', subcategory: 'Burgers & Sandwiches' },
    ],
    tableNumber: '3',
    status: 'ready',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    statusUpdatedAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    specialInstructions: 'Well done patty.'
  },
    {
    id: 'mock-5',
    cart: [
      { dishName: 'Ribeye Steak', price: 25.00, description: 'Juicy steak with crispy fries.', quantity: 1, category: 'Main Courses', subcategory: 'Grilled Meats' },
    ],
    tableNumber: '7',
    status: 'ready',
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
    statusUpdatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
];


export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Using useEffect to set mock data on the client to avoid hydration issues
  // since `createdAt` uses `new Date()`. This runs once after the component mounts.
  useEffect(() => {
    setOrders(MOCK_ORDERS);
  }, []);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'statusUpdatedAt'>): Order => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'placed',
      createdAt: now,
      statusUpdatedAt: now,
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status, statusUpdatedAt: new Date() } : order
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

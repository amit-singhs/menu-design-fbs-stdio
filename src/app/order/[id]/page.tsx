'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderStatus } from '@/components/order-status';
import { useOrders } from '@/context/order-context';
import type { Order } from '@/context/order-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, getOrderById } = useOrders(); // Depend on orders to trigger re-renders
  const [order, setOrder] = useState<Order | undefined | null>(undefined); // undefined: loading, null: not found

  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      // The component will re-render when `orders` changes, so this useEffect will run again.
      setOrder(foundOrder || null);
    }
  }, [orderId, orders, getOrderById]); // Add `orders` to dependency array
  
  const handleBackToMenu = () => {
    // A bit of a hack to reset the main page state. In a real app, you might use a different navigation flow.
    window.location.href = '/';
  }
  
  if (order === undefined) {
    // Loading state
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-pulse">
                <CardHeader className="text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/4 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="pt-1.5 space-y-2 w-full">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="pt-1.5 space-y-2 w-full">
                            <Skeleton className="h-6 w-24" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                         <div className="pt-1.5 space-y-2 w-full">
                            <Skeleton className="h-6 w-24" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (order === null) {
      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
             <Card className="w-full max-w-md text-center p-4">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">Order Not Found</CardTitle>
                    <CardDescription>The order you are looking for does not exist. It might have been cleared or the ID is incorrect.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={handleBackToMenu} className="w-full">Back to Menu</Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  return <OrderStatus order={order} onBackToMenu={handleBackToMenu} />;
}

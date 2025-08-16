'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderStatus } from '@/components/order-status';
import { OrderDetails } from '@/components/order-details';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrderApi } from '@/hooks/use-order-api';
import type { OrderStatusResponse } from '@/lib/api/types';

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderStatus, isLoadingOrderStatus } = useOrderApi();
  const [order, setOrder] = useState<OrderStatusResponse | undefined | null>(undefined);
  const [hasFetched, setHasFetched] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (orderId && !hasFetched && !isLoadingOrderStatus) {
      console.log('Fetching order status for:', orderId);
      setHasFetched(true);
      
      getOrderStatus(orderId).then((orderData) => {
        console.log('Order data received:', orderData);
        setOrder(orderData || null);
      });
    }
  }, [orderId, hasFetched, isLoadingOrderStatus, getOrderStatus]);
  
  const handleBackToMenu = () => {
    // A bit of a hack to reset the main page state. In a real app, you might use a different navigation flow.
    window.location.href = '/';
  }

  const handleViewOrderDetails = () => {
    setShowDetails(true);
  };

  const handleBackToStatus = () => {
    setShowDetails(false);
  };
  
  if (order === undefined || isLoadingOrderStatus) {
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

  if (showDetails && order) {
    return <OrderDetails order={order} onBackToStatus={handleBackToStatus} />;
  }

  return <OrderStatus order={order} onBackToMenu={handleBackToMenu} onViewOrderDetails={handleViewOrderDetails} />;
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Utensils, Check, Clock, Info, Undo2, ChefHat } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { useGetOrders, useUpdateOrderStatus } from '@/lib/api/auth-service';
import { useKitchenOrdersStorage, useOrderTimer } from '@/hooks/use-session-storage';
import { useToast } from '@/hooks/use-toast';
import type { KitchenOrder } from '@/lib/api/types';

function OrderCard({ order, onUpdateStatus }: { order: KitchenOrder; onUpdateStatus: (id: string, status: KitchenOrder['status']) => void }) {
  const [showRevert, setShowRevert] = useState(false);
  const { elapsedTime, totalTime, formatTime, isCompleted } = useOrderTimer(order);

  useEffect(() => {
    if (order.status === 'ready') {
      const timeSinceReady = Date.now() - new Date(order.updated_at).getTime();
      const twoMinutes = 2 * 60 * 1000;

      if (timeSinceReady < twoMinutes) {
        setShowRevert(true);
        const timeoutId = setTimeout(() => {
          setShowRevert(false);
        }, twoMinutes - timeSinceReady);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [order.status, order.updated_at]);

  const getTimeDisplay = () => {
    if (isCompleted) {
      return {
        time: formatTime(totalTime),
        label: 'Total Time',
        className: 'text-gray-600'
      };
    } else {
      return {
        time: formatTime(elapsedTime),
        label: order.status === 'pending' ? 'Waiting' : 'In Progress',
        className: order.status === 'pending' ? 'text-amber-600' : 'text-blue-600'
      };
    }
  };

  const timeDisplay = getTimeDisplay();

  return (
    <Card className="flex flex-col animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="font-headline text-xl">Table #{order.table_number}</span>
          <div className="text-right">
            <div className={`text-sm font-mono font-bold ${timeDisplay.className}`}>
              {timeDisplay.time}
            </div>
            <div className="text-xs text-muted-foreground">
              {timeDisplay.label}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {order.order_items.map(item => (
            <li key={item.id}>
              <div className="flex justify-between items-start text-sm">
                <span className="font-semibold">{item.quantity}x</span>
                <span className="px-2 text-left flex-grow">Item #{item.menu_item_id}</span>
              </div>
              {item.instructions && (
                <p className="pl-6 pt-1 text-xs text-muted-foreground italic">↳ "{item.instructions}"</p>
              )}
            </li>
          ))}
        </ul>
        {order.instructions && (
          <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/40 rounded-md border border-amber-200 dark:border-amber-900">
             <div className="flex items-center gap-2 font-semibold text-sm text-amber-800 dark:text-amber-200">
                <Info className="h-4 w-4" />
                <span>Overall Instructions</span>
             </div>
             <p className="pt-1 pl-6 text-sm text-amber-700 dark:text-amber-300">
                {order.instructions}
             </p>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-muted/30">
        {order.status === 'pending' && (
          <Button className="w-full" onClick={() => onUpdateStatus(order.id, 'preparing')}>
            <Utensils className="mr-2 h-4 w-4" /> Accept & Start Preparing
          </Button>
        )}
        {order.status === 'preparing' && (
          <Button className="w-full bg-chart-2 text-primary-foreground hover:bg-chart-2/90" onClick={() => onUpdateStatus(order.id, 'ready')}>
            <Check className="mr-2 h-4 w-4" /> Mark as Ready
          </Button>
        )}
        {order.status === 'ready' && (
          <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={() => onUpdateStatus(order.id, 'served')}>
            <Check className="mr-2 h-4 w-4" /> Complete
          </Button>
        )}
        {order.status === 'ready' && showRevert && (
            <Button variant="outline" className="w-full" onClick={() => onUpdateStatus(order.id, 'preparing')}>
                <Undo2 className="mr-2 h-4 w-4" /> Move Back to Preparing
            </Button>
        )}
        {order.status === 'served' && (
            <div className="flex items-center justify-center w-full text-green-600 font-semibold text-sm gap-2">
                <Check className="h-4 w-4" />
                <span>Completed</span>
            </div>
        )}
      </CardFooter>
      {isCompleted && (
        <div className="px-4 pb-3 text-center">
          <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 inline-block">
            Total time: {formatTime(totalTime)}
          </div>
        </div>
      )}
    </Card>
  );
}

export function KitchenDisplay() {
  const { toast } = useToast();
  
  // Session storage for orders
  const { orders, updateOrderStatus: updateLocalOrderStatus, updateOrdersList } = useKitchenOrdersStorage();
  
  // API hooks
  const { data: apiOrdersData, isLoading: isLoadingOrders, refetch: refetchOrders } = useGetOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  // Update session storage when API data changes
  useEffect(() => {
    if (apiOrdersData) {
      updateOrdersList(apiOrdersData);
    }
  }, [apiOrdersData, updateOrdersList]);

  const handleUpdateStatus = async (orderId: string, status: KitchenOrder['status']) => {
    try {
      // Update local state immediately for better UX
      updateLocalOrderStatus(orderId, status);
      
      // Make API call to update status
      await updateOrderStatusMutation.mutateAsync({ orderId, status });
      
      toast({
        title: 'Order Updated',
        description: `Order status changed to ${status}.`,
      });
      
      // Refetch orders to ensure consistency
      refetchOrders();
      
    } catch (error) {
      console.error('Update order status error:', error);
      
      // Revert local state on error
      if (apiOrdersData) {
        const originalOrder = apiOrdersData.find(o => o.id === orderId);
        if (originalOrder) {
          updateLocalOrderStatus(orderId, originalOrder.status);
        }
      }
      
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  // Filter orders by status
  const pendingOrders = orders.filter(o => o.status === 'pending').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const preparingOrders = orders.filter(o => o.status === 'preparing').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const readyOrders = orders.filter(o => o.status === 'ready').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const servedOrders = orders.filter(o => o.status === 'served').sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 10);

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <header className="mb-8 text-center sticky top-0 bg-background/80 backdrop-blur-sm py-4 z-10">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary">Kitchen View</h1>
        <p className="text-muted-foreground">Manage incoming orders</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 items-start">
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-amber-600">
            <Clock /> New Orders ({pendingOrders.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              {isLoadingOrders ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : pendingOrders.length > 0 ? (
                pendingOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No new orders.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-blue-600">
            <Utensils /> Preparing ({preparingOrders.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
               {preparingOrders.length > 0 ? (
                preparingOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No orders in preparation.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-green-600">
            <ChefHat /> Ready ({readyOrders.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
               {readyOrders.length > 0 ? (
                readyOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No orders ready.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-gray-600">
            <Check /> Recently Completed ({servedOrders.length})
          </h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
             <div className="space-y-4 pr-4">
               {servedOrders.length > 0 ? (
                servedOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No recently completed orders.</p>
              )}
             </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

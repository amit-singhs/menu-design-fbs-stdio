'use client';

import { useOrders } from '@/context/order-context';
import type { Order, OrderStatus } from '@/context/order-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Utensils, Check, Clock, Info, Undo2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, status: OrderStatus) => void }) {
  const [showRevert, setShowRevert] = useState(false);

  useEffect(() => {
    if (order.status === 'ready') {
      const timeSinceReady = Date.now() - new Date(order.statusUpdatedAt).getTime();
      const twoMinutes = 2 * 60 * 1000;

      if (timeSinceReady < twoMinutes) {
        setShowRevert(true);
        const timeoutId = setTimeout(() => {
          setShowRevert(false);
        }, twoMinutes - timeSinceReady);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [order.status, order.statusUpdatedAt]);


  return (
    <Card className="flex flex-col animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="font-headline text-xl">Table #{order.tableNumber}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatDistanceToNow(order.createdAt, { addSuffix: true })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {order.cart.map(item => (
            <li key={item.dishName}>
              <div className="flex justify-between items-start text-sm">
                <span className="font-semibold">{item.quantity}x</span>
                <span className="px-2 text-left flex-grow">{item.dishName}</span>
              </div>
              {item.specialInstructions && (
                <p className="pl-6 pt-1 text-xs text-muted-foreground italic">↳ "{item.specialInstructions}"</p>
              )}
            </li>
          ))}
        </ul>
        {order.specialInstructions && (
          <div className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/40 rounded-md border border-amber-200 dark:border-amber-900">
             <div className="flex items-center gap-2 font-semibold text-sm text-amber-800 dark:text-amber-200">
                <Info className="h-4 w-4" />
                <span>Overall Instructions</span>
             </div>
             <p className="pt-1 pl-6 text-sm text-amber-700 dark:text-amber-300">
                {order.specialInstructions}
             </p>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-muted/30">
        {order.status === 'placed' && (
          <Button className="w-full" onClick={() => onUpdateStatus(order.id, 'preparing')}>
            <Utensils className="mr-2 h-4 w-4" /> Accept & Start Preparing
          </Button>
        )}
        {order.status === 'preparing' && (
          <Button className="w-full bg-chart-2 text-primary-foreground hover:bg-chart-2/90" onClick={() => onUpdateStatus(order.id, 'ready')}>
            <Check className="mr-2 h-4 w-4" /> Mark as Ready
          </Button>
        )}
        {order.status === 'ready' && showRevert && (
            <Button variant="outline" className="w-full" onClick={() => onUpdateStatus(order.id, 'preparing')}>
                <Undo2 className="mr-2 h-4 w-4" /> Move Back to Preparing
            </Button>
        )}
        {order.status === 'ready' && !showRevert && (
            <div className="flex items-center justify-center w-full text-green-600 font-semibold text-sm gap-2">
                <Check className="h-4 w-4" />
                <span>Completed</span>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function KitchenDisplay() {
  const { orders, updateOrderStatus } = useOrders();

  const newOrders = orders.filter(o => o.status === 'placed').sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
  const preparingOrders = orders.filter(o => o.status === 'preparing').sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
  const readyOrders = orders.filter(o => o.status === 'ready').sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <header className="mb-8 text-center sticky top-0 bg-background/80 backdrop-blur-sm py-4 z-10">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary">Kitchen View</h1>
        <p className="text-muted-foreground">Manage incoming orders</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-amber-600"><Clock /> New Orders ({newOrders.length})</h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              {newOrders.length > 0 ? (
                newOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No new orders.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-blue-600"><Utensils /> Preparing ({preparingOrders.length})</h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
               {preparingOrders.length > 0 ? (
                preparingOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />)
              ) : (
                <p className="text-muted-foreground text-center p-8">No orders in preparation.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="space-y-4 p-2 rounded-lg bg-muted/40">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-green-600"><Check /> Recently Completed</h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
             <div className="space-y-4 pr-4">
               {readyOrders.length > 0 ? (
                readyOrders.map(order => (
                   <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                ))
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

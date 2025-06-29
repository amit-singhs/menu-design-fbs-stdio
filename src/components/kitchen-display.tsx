'use client';

import { useOrders } from '@/context/order-context';
import type { Order, OrderStatus } from '@/context/order-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Utensils, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, status: OrderStatus) => void }) {
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
        <ul className="space-y-2">
          {order.cart.map(item => (
            <li key={item.dishName} className="flex justify-between items-start text-sm">
              <span className="font-semibold">{item.quantity}x</span>
              <span className="px-2 text-left flex-grow">{item.dishName}</span>
              <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-muted/30">
        {order.status === 'placed' && (
          <Button className="w-full" onClick={() => onUpdateStatus(order.id, 'preparing')}>
            <Utensils className="mr-2 h-4 w-4" /> Accept & Start Preparing
          </Button>
        )}
        {order.status === 'preparing' && (
          <Button className="w-full" variant="secondary" onClick={() => onUpdateStatus(order.id, 'ready')}>
            <Check className="mr-2 h-4 w-4" /> Mark as Ready
          </Button>
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
                   <Card key={order.id} className="opacity-80">
                    <CardHeader className="py-3">
                       <CardTitle className="flex justify-between items-center">
                          <span className="font-headline text-lg">Table #{order.tableNumber}</span>
                           <span className="text-xs font-normal text-muted-foreground">
                            {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                          </span>
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                       <p className="text-sm text-muted-foreground">
                        {order.cart.map(i => i.quantity).reduce((a,b) => a+b, 0)} items
                       </p>
                    </CardContent>
                  </Card>
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

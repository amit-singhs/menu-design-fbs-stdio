'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Receipt } from 'lucide-react';
import type { OrderStatusResponse } from '@/lib/api/types';
import { format } from 'date-fns';

interface OrderDetailsProps {
  order: OrderStatusResponse;
  onBackToStatus: () => void;
}

export function OrderDetails({ order, onBackToStatus }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - HH:mm');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'preparing': return 'text-blue-600';
      case 'ready': return 'text-green-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <Receipt className="h-4 w-4" />;
      case 'completed': return <Receipt className="h-4 w-4" />;
      case 'cancelled': return <Receipt className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-0" />
      <Card className="w-full max-w-2xl rounded-2xl shadow-2xl bg-card/80 backdrop-blur-sm z-10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-primary">
            Order Details
          </CardTitle>
          <CardDescription className="text-lg">
            Order #{order.id.slice(0, 8)} • Table #{order.table_number}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <div className={`flex items-center gap-2 font-semibold ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-semibold text-lg">${order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Ordered:</span>
              <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
            </div>
            {order.instructions && (
              <div className="pt-2 border-t">
                <span className="font-medium">Special Instructions:</span>
                <p className="text-sm text-muted-foreground mt-1">{order.instructions}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Item #{item.menu_item_id.slice(0, 8)}</span>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Quantity: {item.quantity}</span>
                      <span>Total: ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.instructions && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {item.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-base"
              onClick={onBackToStatus}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Order Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/app/dashboard/data';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusBadgeVariants: Record<Order['status'], BadgeProps['variant']> = {
  Pending: 'outline',
  Processing: 'secondary',
  Completed: 'default',
  Cancelled: 'destructive',
};

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Order #{order.id}</DialogTitle>
          <DialogDescription>
            Details for the order placed by {order.customer}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-muted-foreground">Customer: </span>
              {order.customer}
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Email: </span>
              {order.email}
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Date: </span>
              {order.date}
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Type: </span>
              {order.type}
            </div>
            {order.type === 'Dine-In' && (
              <div>
                <span className="font-semibold text-muted-foreground">Table: </span>
                {order.tableNumber}
              </div>
            )}
            <div>
              <span className="font-semibold text-muted-foreground">Status: </span>
              <Badge variant={statusBadgeVariants[order.status]} className="text-xs">
                {order.status}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Order Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Qty</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div className='font-medium'>{item.dishName}</div>
                      {item.specialInstructions && <p className='text-xs text-muted-foreground italic'>↳ "{item.specialInstructions}"</p>}
                    </TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {order.specialInstructions && (
              <>
                 <Separator />
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1"><Info className="h-4 w-4" /> Overall Instructions</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                        {order.specialInstructions}
                    </p>
                 </div>
              </>
            )}
          <Separator />
          <div className="flex justify-end items-center font-bold text-lg">
            <span>Total:</span>
            <span className="ml-4">${order.amount.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

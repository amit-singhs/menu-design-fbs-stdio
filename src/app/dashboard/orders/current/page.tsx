'use client';

import { useState } from 'react';
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allOrders, type Order } from "@/app/dashboard/data";
import { OrderDetailsDialog } from '@/components/dashboard/order-details-dialog';

const statusBadgeVariants: Record<Order["status"], BadgeProps["variant"]> = {
  Pending: "outline",
  Processing: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};

export default function CurrentOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const currentOrders = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing');
  
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Current Orders
        </h1>
      </div>
       <Card>
      <CardHeader>
        <CardTitle>Active Orders</CardTitle>
        <CardDescription>
          A list of orders that are currently pending or in preparation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.id}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{order.type}</TableCell>
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant={statusBadgeVariants[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    {selectedOrder && (
        <OrderDetailsDialog 
            order={selectedOrder}
            open={!!selectedOrder}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedOrder(null);
                }
            }}
        />
    )}
    </div>
  );
}

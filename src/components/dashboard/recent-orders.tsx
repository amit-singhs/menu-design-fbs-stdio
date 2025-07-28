'use client'

import { ArrowUpRight, Search } from "lucide-react";
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
import { recentOrders, type Order } from "@/app/dashboard/data";
import Link from "next/link";
import { useState } from "react";
import { OrderDetailsDialog } from "./order-details-dialog";
import { Input } from "../ui/input";

const statusBadgeVariants: Record<Order["status"], BadgeProps["variant"]> = {
  Pending: "outline",
  Processing: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};


export function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
    <Card className="lg:col-span-1 h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="grid gap-2">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
                You have {recentOrders.length} recent orders.
            </CardDescription>
            </div>
             <Button asChild size="sm" className="ml-auto gap-1 w-full sm:w-auto">
                <Link href="/dashboard/orders/history">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
         <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-full"
            />
          </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.email}
                  </div>
                </TableCell>
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
    </>
  );
}

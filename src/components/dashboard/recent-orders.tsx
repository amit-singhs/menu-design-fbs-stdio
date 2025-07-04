import { ArrowUpRight } from "lucide-react";
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

const statusBadgeVariants: Record<Order["status"], BadgeProps["variant"]> = {
  Pending: "outline",
  Processing: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};


export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            You have {recentOrders.length} recent orders.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
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
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

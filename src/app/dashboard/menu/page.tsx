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
import { menuItems, type MenuItem } from "@/app/dashboard/data";
import { FileDown, PlusCircle } from "lucide-react";
import Link from "next/link";

const availabilityBadgeVariants: Record<MenuItem["availability"], BadgeProps["variant"]> = {
  Available: "default",
  Unavailable: "destructive",
};

export default function MenuManagementPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Menu Items
        </h1>
         <div className="flex items-center gap-2 w-full md:w-auto">
          <Button asChild className="w-full md:w-auto">
            <Link href="/dashboard/menu/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Link>
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            <FileDown className="mr-2 h-4 w-4" /> Export Menu
          </Button>
        </div>
      </div>
       <Card>
      <CardHeader>
        <CardTitle>All Menu Items</CardTitle>
        <CardDescription>
          View, edit, and manage all items on your menu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Availability</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                <TableCell className="hidden md:table-cell">${item.price.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                   <Badge className="text-xs" variant={availabilityBadgeVariants[item.availability]}>
                    {item.availability}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{item.stock}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}

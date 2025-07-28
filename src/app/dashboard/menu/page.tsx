'use client'

import { useState } from 'react';
import { Badge, type BadgeProps } from "@/components/ui/badge";
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
import { menuItems as initialMenuItems, type MenuItem } from "@/app/dashboard/data";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const availabilityBadgeVariants: Record<MenuItem["availability"], BadgeProps["variant"]> = {
  Available: "default",
  Unavailable: "destructive",
};

export default function ItemUnavailabilityPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const handleAvailabilityChange = (itemId: string, newAvailability: boolean) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, availability: newAvailability ? 'Available' : 'Unavailable' }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Item Unavailability
        </h1>
      </div>
       <Card>
      <CardHeader>
        <CardTitle>Manage Item Availability</CardTitle>
        <CardDescription>
          Quickly mark items as available or unavailable on your menu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Label htmlFor={`avail-${item.id}`} className="sr-only">
                      Availability
                    </Label>
                     <Switch
                        id={`avail-${item.id}`}
                        checked={item.availability === 'Available'}
                        onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                      />
                    <Badge className="text-xs w-24 justify-center" variant={availabilityBadgeVariants[item.availability]}>
                      {item.availability}
                    </Badge>
                  </div>
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

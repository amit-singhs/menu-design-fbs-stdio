'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { menuItems as initialMenuItems, type MenuItem } from "@/app/dashboard/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MenuForm } from '@/components/menu-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function EditMenuPage() {
    const [menuItems, setMenuItems] = useState(initialMenuItems);
    const [showAddItemForm, setShowAddItemForm] = useState<{
        category: string;
        subcategory?: string;
    } | null>(null);

    const handleMenuSaved = () => {
        // In a real app, you'd refetch data or update state
        setShowAddItemForm(null);
    }

    const groupedMenu = useMemo(() => {
        const groups: Record<string, { subcategories: Record<string, MenuItem[]>, items: MenuItem[] }> = {};

        menuItems.forEach(item => {
            if (!groups[item.category]) {
                groups[item.category] = { subcategories: {}, items: [] };
            }

            if (item.subcategory) {
                if (!groups[item.category].subcategories[item.subcategory]) {
                    groups[item.category].subcategories[item.subcategory] = [];
                }
                groups[item.category].subcategories[item.subcategory].push(item);
            } else {
                groups[item.category].items.push(item);
            }
        });
        return groups;
    }, [menuItems]);

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    Edit Menu
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Menu Structure</CardTitle>
                    <CardDescription>Add, edit, or remove items from your categories and subcategories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog open={!!showAddItemForm} onOpenChange={(isOpen) => !isOpen && setShowAddItemForm(null)}>
                        <Accordion type="multiple" className="w-full">
                            {Object.entries(groupedMenu).map(([category, data]) => (
                                <AccordionItem value={category} key={category}>
                                    <AccordionTrigger className="text-xl font-headline hover:no-underline">
                                        {category}
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4 pr-1 space-y-4">
                                       {/* Items directly under category */}
                                        {data.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                                <span className="font-medium">{item.name}</span>
                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                            </div>
                                        ))}

                                        {/* Subcategories */}
                                        {Object.keys(data.subcategories).length > 0 && (
                                            <Accordion type="multiple" className="w-full">
                                                {Object.entries(data.subcategories).map(([subcategory, items]) => (
                                                    <AccordionItem value={subcategory} key={subcategory}>
                                                        <AccordionTrigger className="text-lg font-semibold pl-4">{subcategory}</AccordionTrigger>
                                                        <AccordionContent className="pl-8 pr-4 space-y-2">
                                                             {items.map(item => (
                                                                <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-background">
                                                                    <span className="font-medium">{item.name}</span>
                                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                                                </div>
                                                            ))}
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setShowAddItemForm({ category, subcategory })}>
                                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item to {subcategory}
                                                                </Button>
                                                            </DialogTrigger>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                        
                                        {/* Add item to category if no subcategories */}
                                        {Object.keys(data.subcategories).length === 0 && (
                                            <DialogTrigger asChild>
                                                <Button variant="secondary" className="w-full mt-4" onClick={() => setShowAddItemForm({ category })}>
                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item to {category}
                                                </Button>
                                            </DialogTrigger>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                         <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="font-headline text-2xl">
                                    Add New Item to {showAddItemForm?.subcategory || showAddItemForm?.category}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4 max-h-[80vh] overflow-y-auto pr-2">
                               <MenuForm onMenuSaved={handleMenuSaved} />
                            </div>
                         </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}

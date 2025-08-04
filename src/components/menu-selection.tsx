'use client';

import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, PlusCircle } from "lucide-react";
import type { FullMenu } from "./welcome/welcome-page";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface MenuSelectionProps {
    menus: FullMenu[];
    onMenuSelect: (menu: FullMenu) => void;
    onCreateNew: () => void;
}

const MenuCard: FC<{ menu: FullMenu, onSelect: () => void }> = ({ menu, onSelect }) => {
    const itemCount = menu.items.length;
    return (
        <Card 
            className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 border-transparent hover:border-primary cursor-pointer flex flex-col justify-between"
            onClick={onSelect}
        >
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <Utensils className="h-6 w-6"/>
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl">{menu.name}</CardTitle>
                        <CardDescription>{itemCount} {itemCount === 1 ? 'item' : 'items'}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardFooter>
                 <Button variant="link" className="p-0 h-auto">View Menu &rarr;</Button>
            </CardFooter>
        </Card>
    );
};

export function MenuSelection({ menus, onMenuSelect, onCreateNew }: MenuSelectionProps) {
    return (
        <div className="min-h-screen w-full bg-muted/40 p-4 sm:p-6 lg:p-8">
             <main className="container mx-auto animate-in fade-in duration-500">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
                        Our Menus
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Select a menu to view its delicious offerings.
                    </p>
                </div>

                {menus.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {menus.map((menu, index) => (
                             <MenuCard key={index} menu={menu} onSelect={() => onMenuSelect(menu)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-xl">No menus have been created yet.</p>
                    </div>
                )}
                
                <Separator className="my-12" />

                <div className="flex justify-center">
                     <Button
                        onClick={onCreateNew}
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-200 text-lg font-bold h-14 px-8 rounded-xl shadow-lg hover:shadow-xl"
                    >
                        <PlusCircle className="mr-2 h-6 w-6"/> Create a New Menu
                    </Button>
                </div>
             </main>
        </div>
    )
}

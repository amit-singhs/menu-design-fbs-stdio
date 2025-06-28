'use client';

import type { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import type { menuItemSchema } from '@/components/menu-form';

type MenuItem = z.infer<typeof menuItemSchema>;

interface MenuProps {
  items: MenuItem[];
}

export function Menu({ items }: MenuProps) {
  return (
    <div className="min-h-screen w-full bg-muted/30 dark:bg-black">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full text-primary-foreground">
                <Utensils className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              Our Exclusive Menu
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card 
              key={index} 
              className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-none bg-card animate-in fade-in slide-in-from-bottom-4" 
              style={{ animationDelay: `${index * 100}ms`}}
            >
                <div className="aspect-[16/10] relative">
                   <Image
                      src={`https://placehold.co/600x400.png`}
                      alt={item.dishName}
                      fill
                      className="object-cover"
                      data-ai-hint="food dish"
                   />
                </div>
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold font-headline text-foreground leading-tight">{item.dishName}</h3>
                    <div className="text-lg font-bold text-primary whitespace-nowrap pt-px">
                        ${item.price.toFixed(2)}
                    </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

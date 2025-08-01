'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MenuForm, type MenuFormValues } from '@/components/menu-form';
import { Menu } from '@/components/menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';
import { useOrders } from '@/context/order-context';
import type { CartItem } from '@/context/order-context';
import { RouteGuard } from '@/components/auth/route-guard';

type PlacedOrderInfo = {
  cart: CartItem[];
  tableNumber: string;
  specialInstructions?: string;
};

export function WelcomePage() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'menu'>('landing');
  const [menuData, setMenuData] = useState<MenuFormValues | null>(null);
  const router = useRouter();
  const { addOrder } = useOrders();

  const handleMenuSaved = (data: MenuFormValues) => {
    setMenuData(data);
    setCurrentStep('menu');
  };

  const handleOrderPlaced = (orderInfo: PlacedOrderInfo) => {
    const newOrder = addOrder(orderInfo);
    router.push(`/order/${newOrder.id}`);
  };

  if (currentStep === 'menu' && menuData) {
    return (
      <RouteGuard>
        <Menu items={menuData.items} onOrderPlaced={handleOrderPlaced} />
      </RouteGuard>
    );
  }
  
  if (currentStep === 'form') {
    return (
      <RouteGuard>
        <MenuForm onMenuSaved={handleMenuSaved} />
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen w-full bg-background">
        <main className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-0" />
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 rounded-2xl shadow-2xl bg-card/80 backdrop-blur-sm z-10">
            <CardHeader className="text-center p-6 sm:p-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary rounded-full text-primary-foreground">
                  <UtensilsCrossed className="h-10 w-10" />
                </div>
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-2">
                Welcome to MenuStart
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Your journey to a stunning digital menu begins now. Let's craft it together.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center px-6 pb-8 sm:px-10 sm:pb-10">
              <Button
                onClick={() => setCurrentStep('form')}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-200 text-lg font-bold h-14 px-8 w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl"
              >
                Create Your Menu
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </RouteGuard>
  );
} 
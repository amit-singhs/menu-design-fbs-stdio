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
import type { MenuItem } from '@/components/menu';
import { MenuSelection } from '../menu-selection';
import { DUMMY_MENUS } from '@/app/menu-data';

type PlacedOrderInfo = {
  cart: CartItem[];
  tableNumber: string;
  specialInstructions?: string;
};

export type FullMenu = {
    name: string;
    items: MenuItem[];
}

export function WelcomePage() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'menuSelection' | 'menuDisplay'>('landing');
  const [createdMenus, setCreatedMenus] = useState<FullMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<FullMenu | null>(null);

  const router = useRouter();
  const { addOrder } = useOrders();

  const allMenus = [...DUMMY_MENUS, ...createdMenus];

  const handleMenuSaved = (data: MenuFormValues) => {
    const newMenu: FullMenu = {
        name: data.menuName,
        items: data.items
    }
    setCreatedMenus(prev => [...prev, newMenu]);
    setCurrentStep('menuSelection');
  };

  const handleOrderPlaced = (orderInfo: PlacedOrderInfo) => {
    const newOrder = addOrder(orderInfo);
    router.push(`/order/${newOrder.id}`);
  };

  const handleMenuSelected = (menu: FullMenu) => {
      setSelectedMenu(menu);
      setCurrentStep('menuDisplay');
  }

  const handleBackToSelection = () => {
    setSelectedMenu(null);
    setCurrentStep('menuSelection');
  }

  if (currentStep === 'menuDisplay' && selectedMenu) {
     return (
        <RouteGuard>
            <Menu items={selectedMenu.items} menuName={selectedMenu.name} onOrderPlaced={handleOrderPlaced} onBack={handleBackToSelection} />
        </RouteGuard>
     )
  }

  if (currentStep === 'menuSelection') {
      return (
        <RouteGuard>
            <MenuSelection menus={allMenus} onMenuSelect={handleMenuSelected} onCreateNew={() => setCurrentStep('form')} />
        </RouteGuard>
      )
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
            <CardContent className="flex flex-col gap-4 justify-center px-6 pb-8 sm:px-10 sm:pb-10">
              <Button
                onClick={() => setCurrentStep('form')}
                size="lg"
                className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-transform duration-200 text-lg font-bold h-14 px-8 w-full rounded-xl shadow-lg hover:shadow-xl"
              >
                Create a New Menu
              </Button>
               <Button
                onClick={() => setCurrentStep('menuSelection')}
                size="lg"
                variant="outline"
                className="transform hover:scale-105 transition-transform duration-200 text-lg font-bold h-14 px-8 w-full rounded-xl shadow-lg hover:shadow-xl"
              >
                View Existing Menus
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </RouteGuard>
  );
} 

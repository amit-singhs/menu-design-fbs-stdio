'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MenuForm, type MenuFormValues } from '@/components/menu-form';
import { Menu } from '@/components/menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'menu'>('landing');
  const [menuData, setMenuData] = useState<MenuFormValues | null>(null);

  const handleMenuSaved = (data: MenuFormValues) => {
    setMenuData(data);
    setCurrentStep('menu');
  };

  if (currentStep === 'menu' && menuData) {
    return <Menu items={menuData.items} />;
  }
  
  if (currentStep === 'form') {
    return <MenuForm onMenuSaved={handleMenuSaved} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-0" />
        <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500 rounded-2xl shadow-2xl bg-card/80 backdrop-blur-sm z-10">
          <CardHeader className="text-center p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary rounded-full text-primary-foreground">
                <UtensilsCrossed className="h-10 w-10" />
              </div>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-2">
              Welcome to MenuStart
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              Your journey to a stunning digital menu begins now. Let's craft it together.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center pb-8 sm:pb-12">
            <Button
              onClick={() => setCurrentStep('form')}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-200 text-lg font-bold py-7 px-10 rounded-xl shadow-lg hover:shadow-xl"
            >
              Create Your Menu
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

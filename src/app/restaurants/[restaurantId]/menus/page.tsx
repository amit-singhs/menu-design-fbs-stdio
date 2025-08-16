'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ArrowRight, AlertCircle } from 'lucide-react';
import { useGetRestaurantMenus } from '@/hooks/graphql';
import Link from 'next/link';

interface Menu {
  id: string;
  name: string;
  description: string;
}

export default function RestaurantMenusPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  const { data, isLoading, error } = useGetRestaurantMenus(restaurantId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sorry Menu Unavailable</h1>
          <p className="text-muted-foreground">
            We couldn't load the menus for this restaurant. Please check the URL or try again later.
          </p>
        </div>
      </div>
    );
  }

  const menus: Menu[] = data?.getRestaurantMenus || [];

  if (menus.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">No Menus Available</h1>
          <p className="text-muted-foreground">
            This restaurant doesn't have any menus available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-black">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-full text-primary-foreground">
              <Utensils className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              Restaurant Menus
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Menu
            </h2>
            <p className="text-muted-foreground text-lg">
              Select a menu to view our delicious offerings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu: Menu, index: number) => (
              <Card
                key={menu.id}
                className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-none bg-card animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Utensils className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {menu.name}
                    </CardTitle>
                  </div>
                  {menu.description && (
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                      {menu.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Link href={`/restaurants/${restaurantId}/menus/${menu.id}`}>
                    <Button className="w-full h-12 text-base group">
                      View Menu
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 
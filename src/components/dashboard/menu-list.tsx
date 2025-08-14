'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Utensils } from 'lucide-react';
import { useGetMenusWithItems } from '@/hooks/graphql/use-menus';
import { useAtom } from 'jotai';
import { menusAtom, selectedMenuAtom, selectedMenuIdAtom, getMenuItemCount } from '@/lib/store/menu-store';
import type { Menu } from '@/lib/store/menu-store';

interface MenuListProps {
  onMenuSelect: (menu: Menu) => void;
  title: string;
  description: string;
}

const MenuCard: React.FC<{ menu: Menu; onSelect: () => void }> = ({ menu, onSelect }) => {
  const itemCount = getMenuItemCount(menu);
  
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
            <CardDescription className="text-sm text-muted-foreground">
              {menu.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <Button variant="link" className="p-0 h-auto">
            View Menu &rarr;
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function MenuList({ onMenuSelect, title, description }: MenuListProps) {
  const router = useRouter();
  const [menus, setMenus] = useAtom(menusAtom);
  const [selectedMenu, setSelectedMenu] = useAtom(selectedMenuAtom);
  const [selectedMenuId, setSelectedMenuId] = useAtom(selectedMenuIdAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Always enable the query, but we'll control when to show loading
  const { data, isLoading, error, refetch } = useGetMenusWithItems({
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update local storage and state when GraphQL data changes
  useEffect(() => {
    if (data?.data?.menus) {
      const fetchedMenus = data.data.menus.map(menu => ({
        ...menu,
        categories: menu.categories.map(category => ({
          ...category,
          sub_categories: category.sub_categories.map(subCategory => ({
            ...subCategory,
            menu_items: subCategory.menu_items.map(item => ({
              ...item,
              available: item.available ?? true // Default to true if not set
            }))
          }))
        }))
      }));
      
      setMenus(fetchedMenus);
      setIsInitialLoad(false);
    }
  }, [data, setMenus, setIsInitialLoad]);

  // Force refresh when needed (e.g., after mutations)
  const handleForceRefresh = () => {
    setIsInitialLoad(true);
    refetch();
  };

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenuId(menu.id);
    onMenuSelect(menu);
  };

  // Show loading only if we're fetching from API and don't have local data
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isLoading && !menus.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading menus...</p>
      </div>
    );
  }

  if (error && !menus.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">Failed to load menus</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleForceRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Clear local storage and force refetch
                localStorage.removeItem('menus');
                handleForceRefresh();
              }}
              disabled={isLoading}
            >
              Clear Cache & Refresh
            </Button>
          </div>
        </div>
      </div>

      {menus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menus.map((menu) => (
            <MenuCard 
              key={menu.id} 
              menu={menu} 
              onSelect={() => handleMenuSelect(menu)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Utensils className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No menus found</h3>
            <p className="text-muted-foreground">
              Create your first menu to get started.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/menu/create')}>
            Create Menu
          </Button>
        </div>
      )}
    </div>
  );
} 
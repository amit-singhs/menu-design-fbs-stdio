'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetRestaurantMenuItems } from '@/hooks/graphql';
import { Menu } from '@/components/menu';
import { AlertCircle } from 'lucide-react';
import { useGetRestaurantMenus } from '@/hooks/graphql';
import type { MenuItem } from '@/components/menu';

interface MenuData {
  id: string;
  name: string;
  description: string;
}

interface CategoryData {
  id: string;
  name: string;
  menu_id: string;
  menu_items: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    available: boolean;
  }>;
  sub_categories: Array<{
    id: string;
    name: string;
    menu_items: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image_url?: string;
      available: boolean;
    }>;
  }>;
}

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;
  const menuId = params.menuId as string;

  const { data: menuItemsData, isLoading: menuItemsLoading, error: menuItemsError } = useGetRestaurantMenuItems(restaurantId);
  const { data: menusData, isLoading: menusLoading } = useGetRestaurantMenus(restaurantId);

  // Find the specific menu
  const menus: MenuData[] = menusData?.getRestaurantMenus || [];
  const currentMenu = menus.find((menu: MenuData) => menu.id === menuId);

  if (menuItemsLoading || menusLoading) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (menuItemsError || !currentMenu) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sorry Menu Unavailable</h1>
          <p className="text-muted-foreground">
            We couldn't load this menu. Please check the URL or try again later.
          </p>
        </div>
      </div>
    );
  }

  // Transform the data structure to match the Menu component's expected format
  const transformMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];
    
    const categories: CategoryData[] = menuItemsData?.getRestaurantMenuItems || [];
    
    categories.forEach((category: CategoryData) => {
      // Add items directly under category
      category.menu_items.forEach((item) => {
        items.push({
          id: item.id,
          dishName: item.name,
          description: item.description || '',
          price: item.price,
          category: category.name,
          subcategory: 'General',
          available: item.available,
        });
      });
      
      // Add items under subcategories
      category.sub_categories.forEach((subCategory) => {
        subCategory.menu_items.forEach((item) => {
          items.push({
            id: item.id,
            dishName: item.name,
            description: item.description || '',
            price: item.price,
            category: category.name,
            subcategory: subCategory.name,
            available: item.available,
          });
        });
      });
    });
    
    return items;
  };

  const menuItems = transformMenuItems();

  const handleOrderPlaced = (order: any) => {
    // Handle order placement - this could redirect to a confirmation page
    console.log('Order placed:', order);
    // You could add a toast notification here
  };

  const handleBack = () => {
    router.push(`/restaurants/${restaurantId}/menus`);
  };

  return (
    <Menu
      items={menuItems}
      menuName={currentMenu.name}
      onOrderPlaced={handleOrderPlaced}
      onBack={handleBack}
    />
  );
} 
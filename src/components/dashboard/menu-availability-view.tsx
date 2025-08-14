'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  DollarSign,
  Package,
  FolderOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedMenuAtom, menusAtom, selectedMenuIdAtom } from '@/lib/store/menu-store';
import { useUpdateMenuItemAvailability } from '@/hooks/graphql/use-menu-items';
import type { Menu, Category, SubCategory, MenuItem } from '@/lib/store/menu-store';

interface MenuAvailabilityViewProps {
  onBack: () => void;
}

export function MenuAvailabilityView({ onBack }: MenuAvailabilityViewProps) {
  const [selectedMenu] = useAtom(selectedMenuAtom);
  const [selectedMenuId] = useAtom(selectedMenuIdAtom);
  const [menus, setMenus] = useAtom(menusAtom);
  const updateMenuItemAvailability = useUpdateMenuItemAvailability();

  if (!selectedMenu) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">No menu selected</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const handleAvailabilityChange = async (itemId: string, newAvailability: boolean) => {
    // Optimistic update - immediately update the UI
    const updatedMenus = menus.map(menu => {
      if (menu.id === selectedMenuId) {
        return {
          ...menu,
          categories: menu.categories.map(category => ({
            ...category,
            sub_categories: category.sub_categories.map(subCategory => ({
              ...subCategory,
              menu_items: subCategory.menu_items.map(item => 
                item.id === itemId 
                  ? { ...item, available: newAvailability }
                  : item
              )
            }))
          }))
        };
      }
      return menu;
    });

    // Update the state immediately
    setMenus(updatedMenus);

    try {
      // Call the GraphQL mutation
      await updateMenuItemAvailability.mutateAsync({
        id: itemId,
        available: newAvailability,
      });
    } catch (error) {
      // If mutation fails, revert the optimistic update
      const revertedMenus = menus.map(menu => {
        if (menu.id === selectedMenuId) {
          return {
            ...menu,
            categories: menu.categories.map(category => ({
              ...category,
              sub_categories: category.sub_categories.map(subCategory => ({
                ...subCategory,
                menu_items: subCategory.menu_items.map(item => 
                  item.id === itemId 
                    ? { ...item, available: !newAvailability } // Revert to original state
                    : item
                )
              }))
            }))
          };
        }
        return menu;
      });
      setMenus(revertedMenus);
      console.error('Failed to update item availability:', error);
    }
  };

  const renderMenuItem = (item: MenuItem, categoryId: string, subcategoryId?: string) => (
    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4 text-muted-foreground" />
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {item.price.toFixed(2)}
        </Badge>
        <div className="flex items-center gap-2">
          <Switch
            id={`availability-${item.id}`}
            checked={item.available !== false} // Default to true if not set
            onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
            disabled={updateMenuItemAvailability.isPending}
          />
          <Label htmlFor={`availability-${item.id}`} className="sr-only">
            Toggle availability for {item.name}
          </Label>
          {updateMenuItemAvailability.isPending && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
          <Badge 
            variant={item.available !== false ? "default" : "destructive"}
            className="flex items-center gap-1 min-w-[100px] justify-center"
          >
            {item.available !== false ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Available
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Unavailable
              </>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderSubCategory = (subcategory: SubCategory, categoryId: string) => (
    <AccordionItem key={subcategory.id} value={subcategory.id}>
      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          {subcategory.name}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6 space-y-3">
        {subcategory.menu_items.map(item => 
          renderMenuItem(item, categoryId, subcategory.id)
        )}
      </AccordionContent>
    </AccordionItem>
  );

  const renderCategory = (category: Category) => (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="text-xl font-headline hover:no-underline">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {category.name}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4 space-y-4">
        {/* Items directly under category */}
        {category.sub_categories.length === 0 && (
          <div className="space-y-2">
            {category.menu_items?.map(item => 
              renderMenuItem(item, category.id)
            )}
          </div>
        )}

        {/* Subcategories */}
        {category.sub_categories.length > 0 && (
          <Accordion type="multiple" className="w-full">
            {category.sub_categories.map(subcategory => 
              renderSubCategory(subcategory, category.id)
            )}
          </Accordion>
        )}
      </AccordionContent>
    </AccordionItem>
  );

  // Count available and unavailable items
  const itemStats = selectedMenu.categories.reduce((stats, category) => {
    category.sub_categories.forEach(subCategory => {
      subCategory.menu_items.forEach(item => {
        if (item.available !== false) {
          stats.available++;
        } else {
          stats.unavailable++;
        }
      });
    });
    return stats;
  }, { available: 0, unavailable: 0 });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Menus
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            {selectedMenu.name} - Item Availability
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedMenu.description}
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available Items</p>
                <p className="text-2xl font-bold text-green-600">{itemStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Unavailable Items</p>
                <p className="text-2xl font-bold text-red-600">{itemStats.unavailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Item Availability</CardTitle>
          <CardDescription>
            Toggle the availability of menu items. Unavailable items will not be shown to customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {selectedMenu.categories.map(renderCategory)}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
} 
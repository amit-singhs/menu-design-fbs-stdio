'use client'

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { selectedMenuAtom, selectedMenuIdAtom, menusAtom } from '@/lib/store/menu-store';
import { useMenuViewStorage } from '@/hooks/use-session-storage';
import { useGetMenusWithItems } from '@/hooks/graphql/use-menus';
import { MenuList } from '@/components/dashboard/menu-list';
import { MenuAvailabilityView } from '@/components/dashboard/menu-availability-view';
import type { Menu } from '@/lib/store/menu-store';

export default function ItemAvailabilityPage() {
  const [selectedMenu, setSelectedMenu] = useAtom(selectedMenuAtom);
  const [selectedMenuId, setSelectedMenuId] = useAtom(selectedMenuIdAtom);
  const [menus] = useAtom(menusAtom);
  const { viewState, setMenuListView, setMenuDetailView, debugViewState } = useMenuViewStorage('item-availability');
  
  // Get loading state from the query
  const { isLoading } = useGetMenusWithItems({
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // Restore view state on component mount
  useEffect(() => {
    debugViewState(); // Debug log
    
    if (viewState.view === 'menu-detail' && viewState.selectedMenuId && menus.length > 0) {
      // Check if the menu still exists in the current menus list
      const menuExists = menus.some(menu => menu.id === viewState.selectedMenuId);
      console.log(`[Item Availability] Menu exists check:`, { 
        selectedMenuId: viewState.selectedMenuId, 
        menuExists, 
        menusCount: menus.length 
      });
      
      if (!menuExists) {
        // If menu doesn't exist, reset to menu list view
        console.log(`[Item Availability] Menu not found, resetting to menu list`);
        setMenuListView();
      } else {
        console.log(`[Item Availability] Restoring menu:`, viewState.selectedMenuId);
        setSelectedMenuId(viewState.selectedMenuId);
      }
    }
  }, [viewState, setSelectedMenuId, menus, setMenuListView, debugViewState]);

  const handleMenuSelect = (menu: Menu) => {
    console.log(`[Item Availability] Menu selected:`, menu.id, menu.name);
    setSelectedMenuId(menu.id);
    setMenuDetailView(menu.id);
  };

  const handleBackToMenus = () => {
    console.log(`[Item Availability] Back to menus clicked`);
    setSelectedMenuId(null);
    setMenuListView();
  };

  // Show loading state while fetching menus and we have a saved view state
  if (isLoading && viewState.view === 'menu-detail' && viewState.selectedMenuId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading menu...</p>
      </div>
    );
  }

  // Show detail view if we have a selected menu or if view state indicates detail view
  const shouldShowDetailView = selectedMenu || (viewState.view === 'menu-detail' && viewState.selectedMenuId && menus.length > 0);
  
  if (shouldShowDetailView) {
    return <MenuAvailabilityView onBack={handleBackToMenus} />;
  }

  return (
    <MenuList
      onMenuSelect={handleMenuSelect}
      title="Item Availability"
      description="Select a menu to manage item availability and status"
    />
  );
}

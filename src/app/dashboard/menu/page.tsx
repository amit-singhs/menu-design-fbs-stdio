'use client'

import { useState } from 'react';
import { MenuList } from '@/components/dashboard/menu-list';
import { MenuAvailabilityView } from '@/components/dashboard/menu-availability-view';
import type { Menu } from '@/lib/store/menu-store';

export default function ItemAvailabilityPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  const handleBackToMenus = () => {
    setSelectedMenu(null);
  };

  if (selectedMenu) {
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

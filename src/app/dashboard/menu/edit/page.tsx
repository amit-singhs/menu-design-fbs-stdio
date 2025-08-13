'use client'

import { useState } from 'react';
import { MenuList } from '@/components/dashboard/menu-list';
import { MenuDetailView } from '@/components/dashboard/menu-detail-view';
import type { Menu } from '@/lib/store/menu-store';

export default function EditMenuPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  const handleBackToMenus = () => {
    setSelectedMenu(null);
  };

  if (selectedMenu) {
    return <MenuDetailView onBack={handleBackToMenus} />;
  }

  return (
    <MenuList
      onMenuSelect={handleMenuSelect}
      title="Edit Menu"
      description="Select a menu to edit categories, subcategories, and items"
    />
  );
}

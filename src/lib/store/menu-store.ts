import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// Types for menu data
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean; // Make available field required with default true
}

export interface SubCategory {
  id: string;
  name: string;
  menu_items: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  sub_categories: SubCategory[];
  menu_items: MenuItem[]; // Add menu_items array for items directly under category
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

// Storage configuration for client-side only
const storage = createJSONStorage<Menu[]>(() => {
  if (typeof window !== 'undefined') {
    return localStorage; // Changed from sessionStorage to localStorage
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
});

// Atoms for menu state management
export const menusAtom = atomWithStorage<Menu[]>('menus', [], storage);
export const selectedMenuIdAtom = atom<string | null>(null);

// Derived atom that automatically updates selected menu when menus change
export const selectedMenuAtom = atom(
  (get) => {
    const selectedMenuId = get(selectedMenuIdAtom);
    const menus = get(menusAtom);
    if (!selectedMenuId) return null;
    return menus.find(menu => menu.id === selectedMenuId) || null;
  },
  (get, set, menu: Menu | null) => {
    set(selectedMenuIdAtom, menu?.id || null);
  }
);

export const isLoadingMenusAtom = atom<boolean>(false);
export const menuErrorAtom = atom<string | null>(null);

// Computed atoms
export const menuCountAtom = atom((get) => get(menusAtom).length);

export const getMenuByIdAtom = atom(
  null,
  (get, set, menuId: string) => {
    const menus = get(menusAtom);
    return menus.find(menu => menu.id === menuId) || null;
  }
);

// Helper function to count total items in a menu
export const getMenuItemCount = (menu: Menu): number => {
  return menu.categories.reduce((total, category) => {
    // Count items directly under category
    const categoryItems = category.menu_items?.length || 0;
    // Count items under subcategories
    const subcategoryItems = category.sub_categories.reduce((subTotal, subCategory) => {
      return subTotal + subCategory.menu_items.length;
    }, 0);
    return total + categoryItems + subcategoryItems;
  }, 0);
}; 
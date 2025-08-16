/**
 * GraphQL Hooks Index
 * Export all GraphQL hooks for easy importing
 */

export { useGetMenusWithItems, useGetRestaurantMenus, useHasMenus, useMenuData } from './use-menus';
export { 
  useInsertMenuItem, 
  useInsertMultipleMenuItems, 
  useUpdateMenuItem, 
  useUpdateMenuItemAvailability, 
  useDeleteMenuItem,
  useGetRestaurantMenuItems 
} from './use-menu-items';
export { useInsertCategory, useInsertSubCategory } from './use-categories'; 
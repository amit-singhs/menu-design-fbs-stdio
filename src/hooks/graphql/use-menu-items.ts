/**
 * GraphQL Menu Items Hooks
 * Custom hooks for menu item-related GraphQL operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INSERT_MENU_ITEM, INSERT_MULTIPLE_MENU_ITEMS, UPDATE_MENU_ITEM, UPDATE_MENU_ITEM_AVAILABILITY } from '@/services/graphql/mutations';
import { 
  InsertMenuItemVariables, 
  InsertMenuItemResponse,
  InsertMultipleMenuItemsVariables,
  InsertMultipleMenuItemsResponse,
  UpdateMenuItemVariables,
  UpdateMenuItemResponse,
  UpdateMenuItemAvailabilityVariables,
  UpdateMenuItemAvailabilityResponse
} from '@/lib/graphql/types';
import { useGraphQLClient } from '@/lib/graphql/client';
import { useGraphQLErrorHandler } from '@/lib/graphql/error-handler';
import { toast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { menusAtom } from '@/lib/store/menu-store';
import { useMenuStorage } from '@/hooks/use-local-storage';

/**
 * Hook for inserting a single menu item
 * Provides optimistic updates and proper error handling
 */
export const useInsertMenuItem = () => {
  const queryClient = useQueryClient();
  const client = useGraphQLClient();
  const { handleError } = useGraphQLErrorHandler();

  return useMutation<InsertMenuItemResponse, Error, InsertMenuItemVariables>({
    mutationFn: async (variables: InsertMenuItemVariables) => {
      const response = await client.request<InsertMenuItemResponse>(INSERT_MENU_ITEM, variables);
      return response;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['menus'] });

      // Snapshot the previous value
      const previousMenus = queryClient.getQueryData(['menus']);

      // Optimistically update to the new value
      queryClient.setQueryData(['menus'], (old: any) => {
        if (!old?.data?.menus) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            menus: old.data.menus.map((menu: any) => {
              return {
                ...menu,
                categories: menu.categories.map((category: any) => {
                  if (category.id === variables.category_id) {
                    return {
                      ...category,
                      sub_categories: category.sub_categories.map((subCategory: any) => {
                        if (subCategory.id === variables.sub_category_id) {
                          return {
                            ...subCategory,
                            menu_items: [
                              ...subCategory.menu_items,
                              {
                                id: `temp-${Date.now()}`,
                                name: variables.name,
                                description: variables.description || '',
                                price: variables.price,
                                image_url: variables.image_url,
                                available: variables.available ?? true,
                                category_id: variables.category_id,
                                sub_category_id: variables.sub_category_id,
                              }
                            ]
                          };
                        }
                        return subCategory;
                      })
                    };
                  }
                  return category;
                })
              };
            })
          }
        };
      });

      return { previousMenus };
    },
    onError: (err, variables, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMenus) {
        queryClient.setQueryData(['menus'], context.previousMenus);
      }
      
      const errorMessage = handleError(err, 'InsertMenuItem');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      
      toast({
        title: "Success",
        description: `Menu item "${variables.name}" created successfully!`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

/**
 * Hook for inserting multiple menu items
 * Provides progress tracking and partial failure handling
 */
export const useInsertMultipleMenuItems = () => {
  const queryClient = useQueryClient();
  const client = useGraphQLClient();

  return useMutation<InsertMultipleMenuItemsResponse, Error, InsertMultipleMenuItemsVariables>({
    mutationFn: async (variables: InsertMultipleMenuItemsVariables) => {
      const response = await client.request<InsertMultipleMenuItemsResponse>(INSERT_MULTIPLE_MENU_ITEMS, variables);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

/**
 * Hook for updating a menu item
 * Provides optimistic updates and proper error handling
 */
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  const client = useGraphQLClient();
  const { handleError } = useGraphQLErrorHandler();
  const [menus, setMenus] = useAtom(menusAtom);
  const { updateMenus } = useMenuStorage();

  return useMutation<UpdateMenuItemResponse, Error, UpdateMenuItemVariables>({
    mutationFn: async (variables: UpdateMenuItemVariables) => {
      const response = await client.request<UpdateMenuItemResponse>(UPDATE_MENU_ITEM, variables);
      return response;
    },
    onError: (err, variables) => {
      const errorMessage = handleError(err, 'UpdateMenuItem');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      // Update local storage and state immediately
      const updatedMenus = menus.map(menu => {
        return {
          ...menu,
          categories: menu.categories.map(category => ({
            ...category,
            sub_categories: category.sub_categories.map(subCategory => ({
              ...subCategory,
              menu_items: subCategory.menu_items.map(item => 
                item.id === variables.id 
                  ? { 
                      ...item, 
                      name: data.updateMenuItem.name,
                      description: data.updateMenuItem.description,
                      price: data.updateMenuItem.price
                    }
                  : item
              )
            }))
          }))
        };
      });

      setMenus(updatedMenus);
      updateMenus(updatedMenus);
      
      // Invalidate and refetch for other components
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      
      toast({
        title: "Success",
        description: `Menu item "${data.updateMenuItem.name}" updated successfully!`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

/**
 * Hook for updating menu item availability
 * Provides optimistic updates and proper error handling
 */
export const useUpdateMenuItemAvailability = () => {
  const queryClient = useQueryClient();
  const client = useGraphQLClient();
  const { handleError } = useGraphQLErrorHandler();
  const [menus, setMenus] = useAtom(menusAtom);
  const { updateMenus } = useMenuStorage();

  return useMutation<UpdateMenuItemAvailabilityResponse, Error, UpdateMenuItemAvailabilityVariables>({
    mutationFn: async (variables: UpdateMenuItemAvailabilityVariables) => {
      const response = await client.request<UpdateMenuItemAvailabilityResponse>(UPDATE_MENU_ITEM_AVAILABILITY, variables);
      return response;
    },
    onError: (err, variables) => {
      const errorMessage = handleError(err, 'UpdateMenuItemAvailability');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      // Update local storage and state immediately
      const updatedMenus = menus.map(menu => {
        return {
          ...menu,
          categories: menu.categories.map(category => ({
            ...category,
            sub_categories: category.sub_categories.map(subCategory => ({
              ...subCategory,
              menu_items: subCategory.menu_items.map(item => 
                item.id === variables.id 
                  ? { ...item, available: variables.available }
                  : item
              )
            }))
          }))
        };
      });

      setMenus(updatedMenus);
      updateMenus(updatedMenus);
      
      // Invalidate and refetch for other components
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      
      const status = variables.available ? 'available' : 'unavailable';
      toast({
        title: "Success",
        description: `Menu item "${data.updateMenuItem.name}" marked as ${status}!`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}; 
/**
 * GraphQL Category Hooks
 * Custom hooks for category-related GraphQL operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INSERT_CATEGORY } from '@/services/graphql/mutations';
import { InsertCategoryVariables, InsertCategoryResponse } from '@/lib/graphql/types';
import { useGraphQLClient } from '@/lib/graphql/client';
import { useGraphQLErrorHandler } from '@/lib/graphql/error-handler';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for inserting a new category
 * Provides optimistic updates and proper error handling
 */
export const useInsertCategory = () => {
  const queryClient = useQueryClient();
  const client = useGraphQLClient();
  const { handleError } = useGraphQLErrorHandler();

  return useMutation<InsertCategoryResponse, Error, InsertCategoryVariables>({
    mutationFn: async (variables: InsertCategoryVariables) => {
      const response = await client.request<InsertCategoryResponse>(INSERT_CATEGORY, variables);
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
              if (menu.id === variables.menu_id) {
                return {
                  ...menu,
                  categories: [
                    ...menu.categories,
                    {
                      id: `temp-${Date.now()}`, // Temporary ID for optimistic update
                      name: variables.name,
                      sub_categories: [],
                      menu_items: [], // Add empty menu_items array for items directly under category
                    }
                  ]
                };
              }
              return menu;
            })
          }
        };
      });

      // Return a context object with the snapshotted value
      return { previousMenus };
    },
    onError: (err, variables, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMenus) {
        queryClient.setQueryData(['menus'], context.previousMenus);
      }
      
      const errorMessage = handleError(err, 'InsertCategory');
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
        description: `Category "${variables.name}" created successfully!`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}; 
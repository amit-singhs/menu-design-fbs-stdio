/**
 * GraphQL Hooks for Menu Operations
 * Custom hooks for menu-related GraphQL queries using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { graphqlClient } from '../../lib/graphql/client';
import { GET_MENUS_WITH_ITEMS, GET_RESTAURANT_MENUS, QUERY_KEYS } from '../../services/graphql/queries';
import type { 
  GetMenusWithItemsVariables, 
  GetMenusWithItemsResponse,
  GraphQLResponse,
  GetRestaurantMenusResponse,
  GetRestaurantMenusVariables 
} from '../../lib/graphql/types';
import { getRestaurantIdForGraphQL, validateGraphQLAuthentication } from '../../lib/utils/jwt-utils';
import { useGraphQLErrorHandler } from '../../lib/graphql/error-handler';

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get restaurant ID safely for SSR
 */
function getRestaurantIdSafely(): string {
  try {
    return getRestaurantIdForGraphQL();
  } catch (error) {
    // During SSR, return a placeholder
    return 'ssr-placeholder';
  }
}

/**
 * Hook to fetch menus with items (authenticated)
 */
export const useGetMenusWithItems = () => {
  const { handleError } = useGraphQLErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.menus.withItems,
    queryFn: async () => {
      const response = await graphqlClient.execute<GetMenusWithItemsResponse>(GET_MENUS_WITH_ITEMS);
      
      if (response.error) {
        handleError(response.error, 'GetMenusWithItems');
        throw new Error(response.error.message);
      }
      
      if (response.errors && response.errors.length > 0) {
        handleError(response.errors[0], 'GetMenusWithItems');
        throw new Error(response.errors[0].message);
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch restaurant menus (public access)
 */
export const useGetRestaurantMenus = (restaurantId: string) => {
  const { handleError } = useGraphQLErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.menus.byRestaurant(restaurantId),
    queryFn: async () => {
      const response = await graphqlClient.executePublicQuery<GetRestaurantMenusResponse>(
        GET_RESTAURANT_MENUS,
        { restaurant_id: restaurantId }
      );
      
      if (response.error) {
        handleError(response.error, 'GetRestaurantMenus');
        throw new Error(response.error.message);
      }
      
      if (response.errors && response.errors.length > 0) {
        handleError(response.errors[0], 'GetRestaurantMenus');
        throw new Error(response.errors[0].message);
      }
      
      return response.data;
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to check if restaurant has any menus
 * @returns boolean indicating if restaurant has menus
 */
export function useHasMenus() {
  const isClient = isBrowser();
  
  // Check if we have authentication before enabling the query
  const hasAuth = isClient && validateGraphQLAuthentication();
  
  const { data, isLoading, error, refetch } = useGetMenusWithItems();
  
  return {
    hasMenus: isClient ? (data?.data?.menus && data.data.menus.length > 0) : false,
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    menus: isClient ? (data?.data?.menus || []) : [],
    refetch: isClient ? refetch : () => {},
  };
}

/**
 * Hook to get menu data with loading and error states
 * @returns menu data with proper loading and error handling
 */
export function useMenuData() {
  const isClient = isBrowser();
  const hasAuth = isClient && validateGraphQLAuthentication();
  const { data, isLoading, error, refetch } = useGetMenusWithItems();
  
  return {
    menus: isClient ? (data?.data?.menus || []) : [],
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    refetch: isClient ? refetch : () => {},
    isEmpty: isClient ? (!isLoading && (!data?.data?.menus || data.data.menus.length === 0)) : true,
  };
} 
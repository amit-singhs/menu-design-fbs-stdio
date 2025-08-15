/**
 * GraphQL Hooks for Menu Operations
 * Custom hooks for menu-related GraphQL queries using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { graphqlClient } from '../../lib/graphql/client';
import { GET_MENUS_WITH_ITEMS, QUERY_KEYS } from '../../services/graphql/queries';
import type { 
  GetMenusWithItemsVariables, 
  GetMenusWithItemsResponse,
  GraphQLResponse 
} from '../../lib/graphql/types';
import { getRestaurantIdForGraphQL, validateGraphQLAuthentication } from '../../lib/utils/jwt-utils';

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
 * Hook to fetch menus with items
 * @param options Additional options for the query
 * @returns TanStack Query result with menu data
 */
export function useGetMenusWithItems(options?: {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: boolean;
}) {
  const isClient = isBrowser();
  
  const queryKey = isClient ? QUERY_KEYS.menus.all : ['menus', 'ssr'];
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<GetMenusWithItemsResponse> => {
      // Only run in browser environment
      if (!isClient) {
        throw new Error('Cannot execute GraphQL queries during server-side rendering');
      }

      // Check environment variables
      if (!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT) {
        throw new Error('GraphQL endpoint not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT');
      }

      if (!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY) {
        throw new Error('GraphQL API key not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY');
      }

      // Validate authentication
      if (!validateGraphQLAuthentication()) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await graphqlClient.execute<GetMenusWithItemsResponse['data']>(
        GET_MENUS_WITH_ITEMS,
        {}, // No variables needed
        {
          retry: options?.retry ?? true,
          retryAttempts: 3,
          retryDelay: 1000,
        }
      );

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch menus');
      }

      if (response.errors && response.errors.length > 0) {
        throw new Error(response.errors[0].message || 'GraphQL error occurred');
      }

      if (!response.data) {
        throw new Error('No data received from GraphQL query');
      }

      return { data: response.data };
    },
    enabled: (options?.enabled ?? true) && isClient, // Only enable in browser
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: options?.retry ?? true,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to check if restaurant has any menus
 * @returns boolean indicating if restaurant has menus
 */
export function useHasMenus() {
  const isClient = isBrowser();
  
  // Check if we have authentication before enabling the query
  const hasAuth = isClient && validateGraphQLAuthentication();
  
  const { data, isLoading, error, refetch } = useGetMenusWithItems({
    enabled: isClient && hasAuth,
  });
  
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
  const { data, isLoading, error, refetch } = useGetMenusWithItems({
    enabled: isClient && hasAuth, // Only enable on client side with auth
  });
  
  return {
    menus: isClient ? (data?.data?.menus || []) : [],
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    refetch: isClient ? refetch : () => {},
    isEmpty: isClient ? (!isLoading && (!data?.data?.menus || data.data.menus.length === 0)) : true,
  };
} 
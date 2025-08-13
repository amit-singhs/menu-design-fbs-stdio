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
 * Hook to fetch menus with items for a restaurant
 * @param options Additional options for the query
 * @returns TanStack Query result with menu data
 */
export function useGetMenusWithItems(options?: {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: boolean;
}) {
  const isClient = isBrowser();
  
  console.log('🔍 useGetMenusWithItems Hook Called:', {
    isClient,
    enabled: (options?.enabled ?? true) && isClient,
    hasEnvironmentVars: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT,
    options,
    stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n'), // Show call stack
  });
  
  const queryKey = isClient ? QUERY_KEYS.menus.withItems(getRestaurantIdSafely()) : ['menus', 'ssr'];
  
  console.log('🔍 Query Key:', {
    isClient,
    queryKey,
    restaurantId: isClient ? getRestaurantIdSafely() : 'N/A',
  });
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<GetMenusWithItemsResponse> => {
      console.log('🚀 GraphQL Query Function Executing...');
      console.log('🔍 Query Function Debug:', {
        isClient,
        hasEnvironmentVars: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT,
        hasApiKey: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY,
        timestamp: new Date().toISOString(),
      });
      
      // Only run in browser environment
      if (!isClient) {
        console.log('❌ Not in browser environment, skipping query');
        throw new Error('Cannot execute GraphQL queries during server-side rendering');
      }

      // Check environment variables
      if (!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT) {
        console.error('❌ GraphQL endpoint not configured');
        throw new Error('GraphQL endpoint not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT');
      }

      if (!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY) {
        console.error('❌ GraphQL API key not configured');
        throw new Error('GraphQL API key not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY');
      }

      // Validate authentication
      if (!validateGraphQLAuthentication()) {
        console.log('❌ Authentication validation failed');
        throw new Error('Authentication required. Please log in again.');
      }

      const restaurantId = getRestaurantIdForGraphQL();
      console.log('✅ Restaurant ID extracted:', restaurantId);
      
      console.log('📡 Executing GraphQL query with variables:', { restaurantId });
      console.log('🔍 GraphQL Query Details:', {
        endpoint: process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT,
        hasApiKey: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY,
        query: GET_MENUS_WITH_ITEMS,
      });
      
      const response = await graphqlClient.execute<GetMenusWithItemsResponse['data']>(
        GET_MENUS_WITH_ITEMS,
        { restaurantId },
        {
          retry: options?.retry ?? true,
          retryAttempts: 3,
          retryDelay: 1000,
        }
      );

      console.log('📥 GraphQL Response:', response);

      if (response.error) {
        console.error('❌ GraphQL Error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch menus');
      }

      if (response.errors && response.errors.length > 0) {
        console.error('❌ GraphQL Errors:', response.errors);
        throw new Error(response.errors[0].message || 'GraphQL error occurred');
      }

      if (!response.data) {
        console.error('❌ No data received from GraphQL');
        throw new Error('No data received from GraphQL query');
      }

      console.log('✅ GraphQL query successful:', response.data);
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
  
  // Get restaurant ID for debugging
  let restaurantId = 'N/A';
  try {
    restaurantId = isClient ? getRestaurantIdSafely() : 'N/A';
  } catch (error) {
    console.error('❌ Error getting restaurant ID:', error);
  }
  
  // Additional debugging for authentication
  console.log('🔍 useHasMenus Authentication Check:', {
    isClient,
    hasAuth,
    restaurantId,
    enabled: isClient && hasAuth,
    validateGraphQLResult: isClient ? validateGraphQLAuthentication() : 'N/A',
  });
  
  // If authentication is failing, let's debug why
  if (isClient && !hasAuth) {
    console.log('❌ Authentication failed, debugging...');
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      console.log('🔍 Token check:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        allCookies: document.cookie,
      });
    } catch (error) {
      console.error('❌ Error checking token:', error);
    }
  }
  
  // Temporary: Force enable the query for debugging
  const forceEnable = typeof window !== 'undefined' && (window as any).forceGraphQLQuery === true;
  
  const { data, isLoading, error, refetch } = useGetMenusWithItems({
    enabled: (isClient && hasAuth) || forceEnable, // Force enable for debugging
  });
  
  // Debug: Check if query is enabled
  console.log('🔍 useHasMenus Query Status:', {
    isClient,
    hasAuth,
    enabled: (isClient && hasAuth) || forceEnable,
    isLoading,
    hasData: !!data,
    hasError: !!error,
  });
  
  // Monitor query state changes
  React.useEffect(() => {
    console.log('🔄 useHasMenus Query State Changed:', {
      isLoading,
      hasData: !!data,
      hasError: !!error,
      data: data?.data,
    });
  }, [isLoading, data, error]);
  
  // Log the GraphQL query response in browser console
  if (isClient && data) {
    console.log('📊 GraphQL Query Response (useHasMenus):', {
      data: data.data,
      menus: data.data?.menus,
      menuCount: data.data?.menus?.length || 0,
      hasMenus: data.data?.menus && data.data.menus.length > 0,
    });
  }
  
  if (isClient && error) {
    console.error('❌ GraphQL Query Error (useHasMenus):', error);
  }
  
  console.log('🔍 useHasMenus Debug:', {
    isClient,
    hasAuth,
    enabled: isClient && hasAuth,
    hasMenus: isClient ? (data?.data?.menus && data.data.menus.length > 0) : false,
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    menuCount: isClient ? (data?.data?.menus?.length || 0) : 0,
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
  const { data, isLoading, error, refetch } = useGetMenusWithItems({
    enabled: isClient, // Only enable on client side
  });
  
  return {
    menus: isClient ? (data?.data?.menus || []) : [],
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    refetch: isClient ? refetch : () => {},
    isEmpty: isClient ? (!isLoading && (!data?.data?.menus || data.data.menus.length === 0)) : true,
  };
} 
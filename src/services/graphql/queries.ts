/**
 * GraphQL Query Definitions
 * Centralized location for all GraphQL queries
 */

import { gql } from 'graphql-request';

/**
 * GetMenusWithItems Query
 * Fetches menus with nested categories, sub-categories, and menu items
 */
export const GET_MENUS_WITH_ITEMS = gql`
  query GetMenusWithItems($restaurantId: ID!) {
    menus(restaurant_id: $restaurantId) {
      name
      description
      categories {
        id
        name
        sub_categories {
          id
          name
          menu_items {
            id
            name
            description
            price
          }
        }
      }
    }
  }
`;

/**
 * Query Definitions Object
 * Organized collection of all queries for easy import
 */
export const QUERIES = {
  GET_MENUS_WITH_ITEMS,
} as const;

/**
 * Query Keys for TanStack Query
 * Organized query keys for caching and invalidation
 */
export const QUERY_KEYS = {
  menus: {
    all: ['menus'] as const,
    byRestaurant: (restaurantId: string) => ['menus', 'restaurant', restaurantId] as const,
    withItems: (restaurantId: string) => ['menus', 'with-items', restaurantId] as const,
  },
  categories: {
    all: ['categories'] as const,
    byMenu: (menuId: string) => ['categories', 'menu', menuId] as const,
  },
  menuItems: {
    all: ['menu-items'] as const,
    byCategory: (categoryId: string) => ['menu-items', 'category', categoryId] as const,
    bySubCategory: (subCategoryId: string) => ['menu-items', 'sub-category', subCategoryId] as const,
  },
} as const; 
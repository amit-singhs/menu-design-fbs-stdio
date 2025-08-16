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
  query GetMenusWithItems {
    menus {
      id
      name
      description
      categories {
        id
        name
        menu_items {
          id
          name
          description
          price
          available
        }
        sub_categories {
          id
          name
          menu_items {
            id
            name
            description
            price
            available
          }
        }
      }
    }
  }
`;

/**
 * GetRestaurantMenus Query
 * Fetches all menus for a specific restaurant (public access)
 */
export const GET_RESTAURANT_MENUS = gql`
  query GetRestaurantMenus($restaurant_id: ID!) {
    getRestaurantMenus(restaurant_id: $restaurant_id) {
      id
      name
      description
    }
  }
`;

/**
 * GetRestaurantMenuItems Query
 * Fetches menu items for a specific restaurant (public access)
 */
export const GET_RESTAURANT_MENU_ITEMS = gql`
  query GetRestaurantMenuItems($restaurant_id: ID!) {
    getRestaurantMenuItems(restaurant_id: $restaurant_id) {
      id
      name
      menu_id
      menu_items {
        id
        name
        description
        price
        image_url
        available
      }
      sub_categories {
        id
        name
        menu_items {
          id
          name
          description
          price
          image_url
          available
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
  GET_RESTAURANT_MENUS,
  GET_RESTAURANT_MENU_ITEMS,
} as const;

/**
 * Query Keys for TanStack Query
 * Organized query keys for caching and invalidation
 */
export const QUERY_KEYS = {
  menus: {
    all: ['menus'] as const,
    withItems: ['menus', 'with-items'] as const,
    byRestaurant: (restaurantId: string) => ['menus', 'restaurant', restaurantId] as const,
  },
  categories: {
    all: ['categories'] as const,
    byMenu: (menuId: string) => ['categories', 'menu', menuId] as const,
  },
  menuItems: {
    all: ['menu-items'] as const,
    byCategory: (categoryId: string) => ['menu-items', 'category', categoryId] as const,
    bySubCategory: (subCategoryId: string) => ['menu-items', 'sub-category', subCategoryId] as const,
    byRestaurant: (restaurantId: string) => ['menu-items', 'restaurant', restaurantId] as const,
  },
} as const; 
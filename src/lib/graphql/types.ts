/**
 * GraphQL Type Definitions
 * Comprehensive TypeScript interfaces for all GraphQL operations
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base Menu Item interface
 */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  available: boolean;
  category_id: string;
  sub_category_id?: string | null;
}

/**
 * Base SubCategory interface
 */
export interface SubCategory {
  id: string;
  name: string;
  menu_items: MenuItem[];
}

/**
 * Base Category interface
 */
export interface Category {
  id: string;
  name: string;
  sub_categories: SubCategory[];
}

/**
 * Base Menu interface
 */
export interface Menu {
  name: string;
  description: string;
  categories: Category[];
}

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Menu Item Input for mutations
 */
export interface MenuItemInput {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  available?: boolean;
  category?: string;
  sub_category?: string;
}

/**
 * Insert Multiple Menu Items Input
 */
export interface InsertMultipleMenuItemsInput {
  menuName: string;
  descriptions: string;
  menuItems: MenuItemInput[];
}

/**
 * Category Input for mutations
 */
export interface CategoryInput {
  menu_id: string;
  name: string;
}

// ============================================================================
// QUERY TYPES
// ============================================================================

/**
 * GetMenusWithItems Query Variables
 */
export interface GetMenusWithItemsVariables {
  restaurantId: string;
}

/**
 * GetMenusWithItems Query Response
 */
export interface GetMenusWithItemsResponse {
  data: {
    menus: Menu[];
  };
}

// ============================================================================
// MUTATION TYPES
// ============================================================================

/**
 * InsertCategory Mutation Variables
 */
export interface InsertCategoryVariables {
  menu_id: string;
  name: string;
}

/**
 * InsertCategory Mutation Response
 */
export interface InsertCategoryResponse {
  data: {
    insertCategory: {
      id: string;
      name: string;
      menu_id: string;
    };
  };
}

/**
 * InsertMenuItem Mutation Variables
 */
export interface InsertMenuItemVariables {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  available?: boolean;
  category_id?: string;
  sub_category_id?: string | null;
}

/**
 * InsertMenuItem Mutation Response
 */
export interface InsertMenuItemResponse {
  data: {
    insertMenuItem: {
      id: string;
      name: string;
      price: number;
      category_id: string;
      sub_category_id: string | null;
    };
  };
}

/**
 * InsertMultipleMenuItems Mutation Variables
 */
export interface InsertMultipleMenuItemsVariables {
  input: InsertMultipleMenuItemsInput;
}

/**
 * InsertMultipleMenuItems Mutation Response
 */
export interface InsertMultipleMenuItemsResponse {
    insertMultipleMenuItems: {
      success: boolean;
      message: string;
      menuId: string;
      errors: string[] | null;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * GraphQL Error interface
 */
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, any>;
}

/**
 * Network Error interface
 */
export interface NetworkError {
  message: string;
  status?: number;
  statusText?: string;
}

/**
 * Generic Error Response
 */
export interface ErrorResponse {
  errors?: GraphQLError[];
  message?: string;
  status?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic GraphQL Response wrapper
 */
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  loading?: boolean;
  error?: NetworkError | GraphQLError;
}

/**
 * Query/Mutation Options
 */
export interface GraphQLOptions {
  variables?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
} 
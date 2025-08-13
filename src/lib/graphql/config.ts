/**
 * GraphQL Configuration Constants
 * Centralized configuration for GraphQL client settings
 */

export const GRAPHQL_CONFIG = {
  // GraphQL endpoint from environment variable
  ENDPOINT: process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT || '',
  
  // API key for GraphQL service access
  API_KEY: process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY || '',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Cache configuration
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
} as const;

/**
 * GraphQL Headers Configuration
 */
export const GRAPHQL_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': GRAPHQL_CONFIG.API_KEY,
} as const;

/**
 * GraphQL Error Types
 */
export enum GraphQLErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
}

/**
 * GraphQL Response Status
 */
export enum GraphQLResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
} 
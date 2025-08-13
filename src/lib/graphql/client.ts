/**
 * GraphQL Client Configuration
 * Professional GraphQL client setup with TanStack Query integration
 */

import { GRAPHQL_CONFIG, GRAPHQL_HEADERS, GraphQLErrorType } from './config';
import type { GraphQLOptions, GraphQLResponse, GraphQLError, NetworkError } from './types';
import { GraphQLErrorHandler } from './error-handler';
import { getCookie, COOKIE_KEYS } from '@/lib/cookies';

/**
 * GraphQL Client Class
 * Handles all GraphQL operations with proper error handling and caching
 */
export class GraphQLClient {
  private endpoint: string;
  private headers: Record<string, string>;

  constructor() {
    this.endpoint = GRAPHQL_CONFIG.ENDPOINT;
    this.headers = { ...GRAPHQL_HEADERS };
    
    console.log('🔧 GraphQL Client Constructor:', {
      endpoint: this.endpoint,
      hasApiKey: !!GRAPHQL_CONFIG.API_KEY,
      headers: this.headers,
    });
    
    if (!this.endpoint) {
      throw new Error('GraphQL endpoint is not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT');
    }
    
    if (!GRAPHQL_CONFIG.API_KEY) {
      throw new Error('GraphQL API key is not configured. Please set NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY');
    }
  }

  /**
   * Execute GraphQL query or mutation
   */
  async execute<T = any>(
    query: string,
    variables?: Record<string, any>,
    options?: GraphQLOptions
  ): Promise<GraphQLResponse<T>> {
    try {
      const requestBody = {
        query,
        variables: variables || {},
      };

      // Get JWT token from cookies
      const authToken = getCookie(COOKIE_KEYS.AUTH_TOKEN);
      const headers = { ...this.headers };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      console.log('🚀 GraphQL Execute:', {
        endpoint: this.endpoint,
        query: query.substring(0, 100) + '...',
        variables,
        hasAuthToken: !!authToken,
        headers: headers,
      });

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          ...headers,
          ...options?.headers,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(options?.timeout || GRAPHQL_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('📥 GraphQL Response:', {
        status: response.status,
        ok: response.ok,
        result,
        hasErrors: !!(result.errors && result.errors.length > 0),
        hasData: !!result.data,
      });

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        this.handleError(result.errors[0], 'GraphQL Response');
        return {
          errors: result.errors,
          error: this.createGraphQLError(result.errors[0]),
        };
      }

      // Handle different response structures
      let responseData = result.data;
      
      // If there's no data property, the response might be the data itself
      if (!responseData && result.insertMultipleMenuItems) {
        responseData = result;
      }
      
      return {
        data: responseData,
      };
    } catch (error) {
      this.handleError(error, 'Network Request');
      return {
        error: this.createNetworkError(error),
      };
    }
  }

  /**
   * Execute GraphQL query with retry logic
   */
  async executeWithRetry<T = any>(
    query: string,
    variables?: Record<string, any>,
    options?: GraphQLOptions
  ): Promise<GraphQLResponse<T>> {
    const maxRetries = options?.retryAttempts || GRAPHQL_CONFIG.RETRY_ATTEMPTS;
    const retryDelay = options?.retryDelay || GRAPHQL_CONFIG.RETRY_DELAY;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.execute<T>(query, variables, options);
        
        // If successful, return immediately
        if (result.data && !result.errors) {
          return result;
        }

        // If it's the last attempt, return the error
        if (attempt === maxRetries) {
          return result;
        }

        // Wait before retrying
        await this.delay(retryDelay * Math.pow(2, attempt));
      } catch (error) {
        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          return {
            error: this.createNetworkError(error),
          };
        }

        // Wait before retrying
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    return {
      error: {
        message: 'Max retry attempts exceeded',
        status: 500,
      },
    };
  }

  /**
   * Execute GraphQL query directly with restaurantId
   * @param restaurantId Restaurant ID to query for
   * @returns Promise with menu data
   */
  async executeGetMenusWithItems(restaurantId: string): Promise<any> {
    try {
      console.log('🚀 Direct GraphQL Query:', {
        endpoint: this.endpoint,
        restaurantId,
        hasApiKey: !!GRAPHQL_CONFIG.API_KEY,
      });

      const query = `
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

      const response = await this.execute(query, { restaurantId });
      
      console.log('📥 Direct GraphQL Response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Direct GraphQL Query Error:', error);
      throw error;
    }
  }

  /**
   * Generic request method for GraphQL operations
   * @param query GraphQL query or mutation string
   * @param variables Variables for the query/mutation
   * @returns Promise with the response data
   */
  async request<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await this.execute<T>(query, variables);
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    if (response.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }
    
    // Check if we have data, if not, this might be an error
    if (!response.data) {
      throw new Error('No data received from GraphQL operation');
    }
    
    return response.data as T;
  }

  /**
   * Add custom headers to the client
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Get current headers
   */
  getHeaders(): Record<string, string> {
    return { ...this.headers };
  }

  /**
   * Create GraphQL error from response
   */
  private createGraphQLError(error: any): GraphQLError {
    return {
      message: error.message || 'GraphQL error occurred',
      locations: error.locations,
      path: error.path,
      extensions: error.extensions,
    };
  }

  /**
   * Create network error from fetch error
   */
  private createNetworkError(error: any): NetworkError {
    return {
      message: error.message || 'Network error occurred',
      status: error.status,
      statusText: error.statusText,
    };
  }

  /**
   * Handle error with centralized error handling
   */
  private handleError(error: any, context?: string): void {
    // Only log errors that are actual errors, not successful responses
    if (error && (error.message || error.errors || error.status)) {
      GraphQLErrorHandler.logError(error, context);
    }
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create and export a singleton instance of the GraphQL client
 */
export const graphqlClient = new GraphQLClient();

/**
 * React hook to get the GraphQL client instance
 */
export const useGraphQLClient = () => {
  return graphqlClient;
}; 